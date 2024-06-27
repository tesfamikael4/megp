import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ENTITY_MANAGER_KEY, ExtraCrudService } from 'megp-shared-be';
import {
  EvalItemResponse,
  EvalResponse,
  OpenedItemResponse,
  OpenedOffer,
  OpenedResponse,
  RFX,
  RFXItem,
  RfxBidProcedure,
  RfxProcurementTechnicalTeam,
  SolRegistration,
  SolResponse,
  SolRound,
  SolRoundAward,
  TeamMember,
} from 'src/entities';
import { EntityManager, MoreThanOrEqual, Repository } from 'typeorm';
import { CreateEvalResponseDto } from '../dtos/eval-response.dto';
import {
  EInvitationStatus,
  ERfxItemStatus,
  ERfxStatus,
  ESolRegistrationStatus,
  ESolRoundStatus,
  EvaluationResponse,
} from 'src/utils/enums';
import { REQUEST } from '@nestjs/core';
import { CreateEvalAssessmentDto } from '../dtos/eval-assessment.dto';
import { EvalAssessment } from 'src/entities/eval-assessment.entity';
import { RfxDocumentaryEvidence } from 'src/entities/rfx-documentary-evidence.entity';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class EvalResponseService extends ExtraCrudService<EvalResponse> {
  constructor(
    @InjectRepository(EvalResponse)
    private readonly evalResponseRepository: Repository<EvalResponse>,
    @InjectRepository(EvalItemResponse)
    private readonly evalItemResponseRepository: Repository<EvalItemResponse>,
    @InjectRepository(EvalAssessment)
    private readonly evalAssessmentRepository: Repository<EvalAssessment>,
    @InjectRepository(SolRegistration)
    private readonly solRegistrationRepository: Repository<SolRegistration>,
    @InjectRepository(OpenedResponse)
    private readonly openedResponseRepository: Repository<OpenedResponse>,
    @InjectRepository(OpenedItemResponse)
    private readonly openedItemResponseRepository: Repository<OpenedItemResponse>,
    @InjectRepository(RFX)
    private readonly rfxRepository: Repository<RFX>,
    @InjectRepository(TeamMember)
    private readonly teamMemberRepository: Repository<TeamMember>,
    @Inject('WORKFLOW_EVALUATION_RMQ_SERVICE')
    private readonly workflowRMQClient: ClientProxy,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    super(evalResponseRepository);
  }

  async create(itemData: CreateEvalResponseDto, version: number, req?: any) {
    const [teamMember, numberOfTeam, evaluationsCount, openedResponse] =
      await Promise.all([
        this.teamMemberRepository.findOne({
          where: {
            rfxId: itemData.rfxId,
            personnelId: req.user.userId,
          },
          select: {
            id: true,
            isTeamLead: true,
          },
        }),
        this.teamMemberRepository.count({
          where: {
            rfxId: itemData.rfxId,
          },
        }),
        this.evalResponseRepository.count({
          where: {
            rfxId: itemData.rfxId,
            isTeamAssessment: false,
            version,
            openedResponse: {
              solRegistrationId: itemData.solRegistrationId,
            },
          },
        }),
        this.openedResponseRepository.findOne({
          where: {
            solRegistrationId: itemData.solRegistrationId,
            rfxId: itemData.rfxId,
            rfxDocumentaryEvidenceId: itemData.rfxDocumentaryEvidenceId,
          },
          select: {
            id: true,
          },
        }),
      ]);

    if (!teamMember) throw new BadRequestException('Team Member Not found');

    // if (evaluationsCount >= numberOfTeam)
    //   throw new BadRequestException('Team Member Evaluation Limit Exceeded');

    itemData.teamMemberId = teamMember.id;
    itemData.openedResponseId = openedResponse.id;
    itemData.version = version;

    const evaluationItem = this.evalResponseRepository.create(itemData);
    await this.evalResponseRepository.upsert(evaluationItem, [
      'teamMemberId',
      'rfxId',
      'isTeamAssessment',
      'openedResponseId',
      'version',
    ]);

    return evaluationItem;
  }

  async getEvaluation(
    solRegistrationId: string,
    rfxDocumentaryEvidenceId: string,
    isTeamAssessment: boolean,
    version: number,
    user: any,
  ) {
    const evaluation = await this.evalResponseRepository.findOne({
      where: {
        isTeamAssessment,
        rfxDocumentaryEvidenceId,
        solRegistrationId,
        version,
        teamMember: {
          personnelId: user.userId,
        },
      },
    });

    return evaluation;
  }

  async getTeamMembersEvaluations(
    rfxDocumentaryEvidenceId: string,
    solRegistrationId: string,
    version: number,
    user: any,
  ) {
    const [evaluations, teamLead] = await Promise.all([
      this.evalResponseRepository.find({
        where: {
          rfxDocumentaryEvidenceId,
          solRegistrationId,
          version,
        },
        relations: {
          teamMember: true,
        },
      }),
      this.teamMemberRepository.findOne({
        where: {
          rfx: {
            rfxDocumentaryEvidences: {
              id: rfxDocumentaryEvidenceId,
            },
          },
          personnelId: user.userId,
          isTeamLead: true,
        },
      }),
    ]);

    if (!teamLead) throw new BadRequestException('You are not a team lead');

    return evaluations;
  }

  async canSubmitRfxEvaluation(
    rfxId: string,
    isTeamAssessment: boolean,
    version: number,
    user: any,
  ): Promise<{ canSubmit: boolean; reason?: string }> {
    const teamMember = await this.teamMemberRepository.findOne({
      where: {
        rfxId,
        personnelId: user.userId,
      },
      select: {
        id: true,
        hasEvaluated: true,
      },
    });

    if (!teamMember) throw new BadRequestException('You are not a team member');

    if (teamMember.hasEvaluated && !isTeamAssessment)
      return {
        canSubmit: false,
        reason: 'Evaluation has already been submitted',
      };

    const [solRegistrations, evalAssessments] = await Promise.all([
      this.solRegistrationRepository.find({
        where: {
          rfxId,
          status: ESolRegistrationStatus.REGISTERED,
        },
        select: {
          id: true,
        },
      }),
      this.evalAssessmentRepository.find({
        where: {
          rfxId,
          teamMemberId: teamMember.id,
          isTeamAssessment,
          version,
        },
        select: {
          id: true,
          solRegistrationId: true,
        },
      }),
    ]);

    const canSubmitRfxEvaluation = solRegistrations.every((solReg) =>
      evalAssessments.some(
        (evalAssessment) => evalAssessment.solRegistrationId === solReg.id,
      ),
    );

    if (!canSubmitRfxEvaluation)
      return {
        canSubmit: false,
        reason: 'All vendors evaluation for this RFQ has not ended yet',
      };

    return { canSubmit: true };
  }

  async canStartTeamAssessment(
    rfxId: string,
    user: any,
  ): Promise<{ canSubmit: boolean; reason?: string }> {
    const [teamLeadExists, teamMembers] = await Promise.all([
      this.teamMemberRepository.exists({
        where: {
          rfxId,
          personnelId: user.userId,
          isTeamLead: true,
        },
      }),
      this.teamMemberRepository.find({
        where: {
          rfxId,
        },
        select: {
          id: true,
          hasEvaluated: true,
        },
      }),
    ]);

    if (!teamLeadExists)
      return { canSubmit: false, reason: 'You are not a team leader.' };

    const allDone = teamMembers.findIndex(
      (member) => member.hasEvaluated == false,
    );

    if (allDone != -1)
      return {
        canSubmit: false,
        reason: 'Team members evaluation is not done yet',
      };

    return { canSubmit: true };
  }

  async submitRfxEvaluation(
    rfxId: string,
    isTeamEvaluation: boolean,
    user: any,
  ) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const rfx = await entityManager.getRepository(RFX).findOne({
      where: {
        id: rfxId,
        teamMembers: {
          personnelId: user.userId,
        },
      },
      relations: {
        teamMembers: true,
      },
    });

    if (!rfx) throw new BadRequestException('RFQ for you to submit not found');

    const canSubmit = await this.canSubmitRfxEvaluation(
      rfxId,
      isTeamEvaluation,
      rfx.version,
      user,
    );
    if (!canSubmit.canSubmit)
      throw new BadRequestException(
        'Complete all vendors assessment. You can not submit this RFQ evaluation.',
      );

    await entityManager.getRepository(TeamMember).update(
      {
        rfxId,
        personnelId: user.userId,
      },
      {
        hasEvaluated: true,
      },
    );

    // GENERATE PDF

    if (isTeamEvaluation) {
      const [items, procedure] = await this.filterItems(rfxId, 0);
      await this.calculateRoundWinner(items, procedure.deltaPercentage);
      await this.sendToEvaluators(rfx);
    }
  }

  async canSubmitVendorEvaluation(
    solRegistrationId: string,
    isTeamAssessment: boolean,
    version: number,
    user: any,
  ): Promise<{ canSubmit: boolean; reason?: string }> {
    const [teamMember, alreadySubmitted] = await Promise.all([
      this.teamMemberRepository.findOne({
        where: {
          rfx: {
            solRegistrations: {
              id: solRegistrationId,
            },
          },
          personnelId: user.userId,
        },
        select: {
          id: true,
        },
      }),
      this.evalAssessmentRepository.exists({
        where: {
          isTeamAssessment,
          solRegistrationId,
          teamMember: {
            personnelId: user.userId,
          },
        },
      }),
    ]);

    if (!teamMember) throw new BadRequestException('You are not a team member');

    if (alreadySubmitted)
      return {
        canSubmit: false,
        reason: 'Evaluation has already been submitted',
      };

    const solRegistration: any = await this.solRegistrationRepository
      .createQueryBuilder('solRegistrations')
      .where('solRegistrations.id = :solRegistrationId', { solRegistrationId })
      .loadRelationCountAndMap(
        'solRegistrations.totalResponses',
        'solRegistrations.openedResponses',
      )
      .loadRelationCountAndMap(
        'solRegistrations.evaluatedResponses',
        'solRegistrations.evalResponses',
        'eval',
        (qb) =>
          qb
            .where('eval.isTeamAssessment = :isTeamAssessment', {
              isTeamAssessment,
            })
            .andWhere('eval.teamMemberId = :teamMemberId', {
              teamMemberId: teamMember.id,
            })
            .andWhere('eval.version = :version', {
              version,
            }),
      )
      .loadRelationCountAndMap(
        'solRegistrations.evaluatedItemResponses',
        'solRegistrations.evalItemResponses',
        'evalItem',
        (qb) =>
          qb
            .where('evalItem.isTeamAssessment = :isTeam', {
              isTeam: isTeamAssessment,
            })
            .where('evalItem.version = :evalVersion', {
              evalVersion: version,
            })
            .andWhere('evalItem.teamMemberId = :teamId', {
              teamId: teamMember.id,
            }),
      )
      .loadRelationCountAndMap(
        'solRegistrations.totalItemResponses',
        'solRegistrations.openedItemResponses',
      )
      .getOne();

    if (solRegistration.totalResponses != solRegistration.evaluatedResponses)
      return {
        canSubmit: false,
        reason: 'Documentary Evaluation for Registration is not yet completed',
      };

    if (
      solRegistration.totalItemResponses !=
      solRegistration.evaluatedItemResponses
    )
      return {
        canSubmit: false,
        reason: 'Documentary Evaluation for RFQ Items is not yet completed',
      };

    return { canSubmit: true };
  }

  async canSubmitVendorsEvaluation(
    solRegistrationId: string,
    isTeamAssessment: boolean,
    version: number,
    user: any,
  ): Promise<{ canSubmit: boolean; reason?: string }> {
    const [teamMember, alreadySubmitted] = await Promise.all([
      this.teamMemberRepository.findOne({
        where: {
          rfx: {
            solRegistrations: {
              id: solRegistrationId,
            },
          },
          personnelId: user.userId,
        },
        select: {
          id: true,
        },
      }),
      this.evalAssessmentRepository.exists({
        where: {
          isTeamAssessment,
          solRegistrationId,
          teamMember: {
            personnelId: user.userId,
          },
        },
      }),
    ]);

    if (!teamMember) throw new BadRequestException('You are not a team member');

    if (alreadySubmitted)
      return {
        canSubmit: false,
        reason: 'Evaluation has already been submitted',
      };

    const [
      openedResponses,
      evalResponses,
      openedItemResponses,
      evalItemResponses,
    ] = await Promise.all([
      this.openedResponseRepository.find({
        where: {
          solRegistrationId,
        },
        select: {
          id: true,
        },
      }),
      this.evalResponseRepository.find({
        where: {
          isTeamAssessment,
          solRegistrationId,
          teamMemberId: teamMember.id,
          version,
        },
        select: {
          id: true,
          openedResponseId: true,
        },
      }),
      this.openedItemResponseRepository.find({
        where: {
          solRegistrationId,
        },
        select: {
          id: true,
        },
      }),
      this.evalItemResponseRepository.find({
        where: {
          isTeamAssessment,
          solRegistrationId,
          teamMemberId: teamMember.id,
          version,
        },
        select: {
          id: true,
        },
      }),
    ]);

    const canSubmitResponse = openedResponses.every((openedResp) =>
      evalResponses.some(
        (evalResp) => evalResp.openedResponseId === openedResp.id,
      ),
    );
    const canSubmitItemResponse = openedItemResponses.every((openedResp) =>
      evalItemResponses.some(
        (evalResp) => evalResp.openedItemResponseId === openedResp.id,
      ),
    );

    if (!canSubmitResponse)
      return {
        canSubmit: false,
        reason: 'Documentary Evaluation for Registration is not yet completed',
      };

    if (!canSubmitItemResponse)
      return {
        canSubmit: false,
        reason: 'Documentary Evaluation for RFQ Items is not yet completed',
      };

    return { canSubmit: true };
  }

  async submitVendorEvaluataion(
    solRegistrationId: string,
    isTeamAssessment: boolean,
    version: number,
    user: any,
  ) {
    const [
      teamMember,
      evalResponses,
      evalItemResponses,
      alreadyEvaluated,
      canSubmit,
    ] = await Promise.all([
      this.teamMemberRepository.findOne({
        where: {
          rfx: {
            solRegistrations: {
              id: solRegistrationId,
            },
          },
          personnelId: user.userId,
        },
      }),
      this.evalResponseRepository.find({
        where: {
          solRegistrationId,
          isTeamAssessment,
          version,
          teamMember: {
            personnelId: user.userId,
          },
        },
      }),
      this.evalItemResponseRepository.find({
        where: {
          solRegistrationId,
          isTeamAssessment,
          version,
          teamMember: {
            personnelId: user.userId,
          },
        },
      }),
      this.evalAssessmentRepository.exists({
        where: {
          isTeamAssessment: isTeamAssessment,
          solRegistrationId,
          teamMember: {
            personnelId: user.userId,
          },
        },
      }),
      this.canSubmitVendorsEvaluation(
        solRegistrationId,
        isTeamAssessment,
        version,
        user,
      ),
    ]);

    if (!teamMember) throw new BadRequestException('You are not a team member');

    if (alreadyEvaluated)
      throw new BadRequestException(
        'You have already completed this evaluation',
      );

    if (!canSubmit.canSubmit)
      throw new BadRequestException(
        'Complete all vendors assessment. You can not submit this RFQ evaluation.',
      );

    const doesNotComplyResponse = evalResponses.some(
      (ev) =>
        ev.qualified === EvaluationResponse.NOT_COMPLY &&
        ev.version === version,
    );
    const doesNotComplyItem = evalItemResponses.some(
      (ev) =>
        ev.qualified === EvaluationResponse.NOT_COMPLY &&
        ev.version === version,
    );

    const doesNotComply = doesNotComplyItem || doesNotComplyResponse;

    const evaluationAssessmentDto: CreateEvalAssessmentDto = {
      isTeamAssessment,
      qualified: doesNotComply
        ? EvaluationResponse.NOT_COMPLY
        : EvaluationResponse.COMPLY,
      rfxId: teamMember.rfxId,
      teamMemberId: teamMember.id,
      solRegistrationId: solRegistrationId,
    };

    const evaluationAssessment = this.evalAssessmentRepository.create(
      evaluationAssessmentDto,
    );
    await this.evalAssessmentRepository.insert(evaluationAssessment);
    return evaluationAssessment;
  }

  async myResponses(
    rfxId: string,
    solRegistrationId: string,
    isTeamAssessment: boolean,
    version: number,
    user: any,
  ) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const teamMember = await this.teamMemberRepository.findOne({
      where: {
        personnelId: user.userId,
        rfxId,
      },
      select: {
        id: true,
      },
    });

    if (!teamMember)
      throw new BadRequestException(
        'You are not a team member to review this RFQ',
      );

    const documentaryEvidences = await entityManager
      .getRepository(RfxDocumentaryEvidence)
      .createQueryBuilder('rfx_documentary_evidences')
      .where('rfx_documentary_evidences.rfxId = :rfxId', { rfxId })
      .loadRelationCountAndMap(
        'rfx_documentary_evidences.complied',
        'rfx_documentary_evidences.evalResponses',
        'eval',
        (qb) =>
          qb
            .where('eval.qualified = :qualified', {
              qualified: EvaluationResponse.COMPLY,
            })
            .andWhere('eval.teamMemberId = :teamMemberId', {
              teamMemberId: teamMember.id,
            })
            .andWhere('eval.isTeamAssessment = :isTeam', {
              isTeam: isTeamAssessment,
            })
            .andWhere('eval.version = :version', {
              version,
            })
            .andWhere('eval.solRegistrationId = :solReg', {
              solReg: solRegistrationId,
            }),
      )
      .loadRelationCountAndMap(
        'rfx_documentary_evidences.notComplied',
        'rfx_documentary_evidences.evalResponses',
        'eval',
        (qb) =>
          qb
            .where('eval.qualified = :notComplied', {
              notComplied: EvaluationResponse.NOT_COMPLY,
            })
            .andWhere('eval.teamMemberId = :teamId', { teamId: teamMember.id })
            .andWhere('eval.isTeamAssessment = :isTeamAssessment', {
              isTeamAssessment,
            })
            .andWhere('eval.version = :evalVersion', {
              evalVersion: version,
            })
            .andWhere('eval.solRegistrationId = :solRegId', {
              solRegId: solRegistrationId,
            }),
      )
      .getMany();

    return documentaryEvidences;
  }

  async calculateRoundWinner(items: RFXItem[], delta: number) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const roundAwardRepo = entityManager.getRepository(SolRoundAward);
    const openedOfferRepo = entityManager.getRepository(OpenedOffer);
    const itemRepo = entityManager.getRepository(RFXItem);

    const solRoundAwards = [];
    const rankedOffers = [];

    for (const item of items) {
      if (item.openedOffers.length == 0) {
        await itemRepo.update(item.id, {
          status: ERfxItemStatus.ENDED,
        });
        continue;
      }
      const sortedOffers = item.openedOffers.sort(
        (a, b) => a.calculatedPrice - b.calculatedPrice,
      );

      const offerRank = sortedOffers.map((offer, index) => ({
        ...offer,
        updatedAt: undefined,
        rank: index + 1,
      }));
      rankedOffers.push(...offerRank);

      const minPriceOffer = sortedOffers[0];

      const decrement = (minPriceOffer.price * delta) / 100;
      const nextRoundStartingPrice = minPriceOffer.price - decrement;

      solRoundAwards.push({
        rfxProductInvitationId: minPriceOffer.rfxProductInvitationId,
        solOfferId: minPriceOffer.solOfferId,
        openedOfferId: minPriceOffer.id,
        rfxItemId: minPriceOffer.rfxItemId,
        solRoundId: minPriceOffer.solRoundId,
        winnerPrice: minPriceOffer.price,
        nextRoundStartingPrice,
      });
    }

    const createdRoundAwards = roundAwardRepo.create(solRoundAwards);
    await Promise.all([
      roundAwardRepo.upsert(createdRoundAwards, ['rfxItemId', 'solRoundId']),
      openedOfferRepo.upsert(rankedOffers, ['id']),
    ]);
  }

  async filterItems(
    rfxId: string,
    round: number,
  ): Promise<[RFXItem[], RfxBidProcedure]> {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const itemRepo = entityManager.getRepository(RFXItem);
    const rfxRepo = entityManager.getRepository(RFX);
    const roundRepo = entityManager.getRepository(SolRound);
    const procedureRepo = entityManager.getRepository(RfxBidProcedure);

    const [validItems, rfxBidProcedure] = await Promise.all([
      itemRepo
        .createQueryBuilder('rfx_items')
        .where('rfx_items.rfxId = :rfxId', { rfxId })
        .andWhere('rfx_items.status = :status', {
          status: ERfxItemStatus.APPROVED,
        })
        .leftJoinAndSelect('rfx_items.openedOffers', 'openedOffers')
        .leftJoin('openedOffers.solRound', 'solRound')
        .leftJoin('openedOffers.rfxProductInvitation', 'rfxProductInvitations')
        .andWhere('solRound.round = :round', { round })
        .andWhere('rfxProductInvitations.status IN (:...statuses)', {
          statuses: [EInvitationStatus.ACCEPTED, EInvitationStatus.COMPLY],
        })
        .getMany(),
      procedureRepo.findOne({
        where: { rfxId },
        select: { id: true, deltaPercentage: true },
      }),
    ]);

    if (validItems.length == 0) {
      await Promise.all([
        rfxRepo.update(rfxId, {
          status: ERfxStatus.ENDED,
        }),
        roundRepo.update(
          { round: MoreThanOrEqual(round), rfxId },
          {
            status: ESolRoundStatus.CANCELLED,
          },
        ),
      ]);
      throw new NotFoundException(
        `No valid items found for this RFQ id ${rfxId}`,
      );
    }

    return [validItems, rfxBidProcedure];
  }

  private async sendToEvaluators(rfx: RFX) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const eventPayload = {
      id: rfx.id,
      itemName: rfx.name,
      organizationId: rfx.organizationId,
      name: 'RFQEvaluationApproval',
    };
    await entityManager
      .getRepository(RFX)
      .update(rfx.id, { status: ERfxStatus.SUBMITTED_EVALUATION });

    this.workflowRMQClient.emit('initiate-workflow', eventPayload);
  }
}

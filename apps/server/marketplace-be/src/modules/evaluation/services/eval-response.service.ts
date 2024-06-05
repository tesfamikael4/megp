import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ENTITY_MANAGER_KEY, ExtraCrudService } from 'megp-shared-be';
import {
  EvalResponse,
  OpenedResponse,
  RFX,
  RfxProcurementTechnicalTeam,
  SolRegistration,
  SolResponse,
  TeamMember,
} from 'src/entities';
import { EntityManager, Repository } from 'typeorm';
import { CreateEvalResponseDto } from '../dtos/eval-response.dto';
import {
  ERfxStatus,
  ESolRegistrationStatus,
  EvaluationResponse,
} from 'src/utils/enums';
import { REQUEST } from '@nestjs/core';
import { CreateEvalAssessmentDto } from '../dtos/eval-assessment.dto';
import { EvalAssessment } from 'src/entities/eval-assessment.entity';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { RfxDocumentaryEvidence } from 'src/entities/rfx-documentary-evidence.entity';
import { WorkflowHandlerService } from 'src/modules/rfx/services/workflow-handler.service';

@Injectable()
export class EvalResponseService extends ExtraCrudService<EvalResponse> {
  constructor(
    @InjectRepository(EvalResponse)
    private readonly evalResponseRepository: Repository<EvalResponse>,
    @InjectRepository(EvalAssessment)
    private readonly evalAssessmentRepository: Repository<EvalAssessment>,
    @InjectRepository(SolRegistration)
    private readonly solRegistrationRepository: Repository<SolRegistration>,
    @InjectRepository(OpenedResponse)
    private readonly openedResponseRepository: Repository<OpenedResponse>,
    @InjectRepository(RFX)
    private readonly rfxRepository: Repository<RFX>,
    @InjectRepository(TeamMember)
    private readonly teamMemberRepository: Repository<TeamMember>,
    private readonly amqpConnection: AmqpConnection,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    super(evalResponseRepository);
  }

  async create(itemData: CreateEvalResponseDto, req?: any) {
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
            openedResponse: {
              solRegistrationId: itemData.solRegistrationId,
              // vendorId: itemData.vendorId,
            },
          },
        }),
        this.openedResponseRepository.findOne({
          where: {
            solRegistrationId: itemData.solRegistrationId,
            rfxId: itemData.rfxId,
            rfxDocumentaryEvidenceId: itemData.rfxDocumentaryEvidenceId,
            // vendorId: itemData.vendorId,
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

    const evaluationItem = this.evalResponseRepository.create(itemData);
    await this.evalResponseRepository.upsert(evaluationItem, [
      'teamMemberId',
      'rfxId',
      'isTeamAssessment',
      'openedResponseId',
    ]);

    return evaluationItem;
  }

  async getEvaluation(
    solRegistrationId: string,
    rfxDocumentaryEvidenceId: string,
    isTeamAssessment: boolean,
    user: any,
  ) {
    const evaluation = await this.evalResponseRepository.findOne({
      where: {
        isTeamAssessment,
        rfxDocumentaryEvidenceId,
        solRegistrationId,
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
    user: any,
  ) {
    const [evaluations, teamLead] = await Promise.all([
      this.evalResponseRepository.find({
        where: {
          rfxDocumentaryEvidenceId,
          solRegistrationId,
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

    const rfx: any = await this.rfxRepository
      .createQueryBuilder('rfxes')
      .where('rfxes.id = :rfxId', { rfxId })
      .loadRelationCountAndMap(
        'rfxes.solRegistrationCount',
        'rfxes.solRegistrations',
        'registrations',
        (qb) =>
          qb.where('registrations.status = :status', {
            status: ESolRegistrationStatus.REGISTERED,
          }),
      )
      .loadRelationCountAndMap(
        'rfxes.evaluationAssessmentCounts',
        'rfxes.evaluationAssessments',
        'eval',
        (qb) =>
          qb
            .where('eval.teamMemberId = :teamMemberId', {
              teamMemberId: teamMember.id,
            })
            .andWhere('eval.isTeamAssessment = :isTeamAssessment', {
              isTeamAssessment,
            }),
      )
      .getOne();

    if (rfx.solRegistrationCount != rfx.evaluationAssessmentCounts)
      return {
        canSubmit: false,
        reason: 'All vendors evaluation has not ended yet',
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
      const eventPayload = {
        id: rfxId,
        itemName: rfx.name,
        organizationId: rfx.organizationId,
        name: 'RFQEvaluationApproval',
      };
      await entityManager
        .getRepository(RFX)
        .update(rfxId, { status: ERfxStatus.SUBMITTED_EVALUATION });
      this.amqpConnection.publish(
        'workflow-broadcast-exchanges',
        'workflow.initate',
        eventPayload,
      );
    }
  }

  async canSubmitVendorEvaluation(
    solRegistrationId: string,
    isTeamAssessment: boolean,
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

  async submitVendorEvaluataion(
    solRegistrationId: string,
    isTeamAssessment: boolean,
    user: any,
  ) {
    const [teamMember, solRegistration, alreadyEvaluated, canSubmit] =
      await Promise.all([
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
        this.solRegistrationRepository.findOne({
          where: {
            id: solRegistrationId,
          },
          relations: {
            evalResponses: true,
            evalItemResponses: true,
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
        this.canSubmitVendorEvaluation(
          solRegistrationId,
          isTeamAssessment,
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

    const doesNotComplyResponse = solRegistration.evalResponses.some(
      (ev) => ev.qualified === EvaluationResponse.NOT_COMPLY,
    );
    const doesNotComplyItem = solRegistration.evalItemResponses.some(
      (ev) => ev.qualified === EvaluationResponse.NOT_COMPLY,
    );

    const doesNotComply = doesNotComplyItem || doesNotComplyResponse;

    const evaluationAssessmentDto: CreateEvalAssessmentDto = {
      isTeamAssessment,
      qualified: doesNotComply
        ? EvaluationResponse.NOT_COMPLY
        : EvaluationResponse.COMPLY,
      rfxId: solRegistration.rfxId,
      teamMemberId: teamMember.id,
      solRegistrationId: solRegistration.id,
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
    user: any,
  ) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const teamMember = await this.teamMemberRepository.findOne({
      where: {
        personnelId: user.userId,
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
            .andWhere('eval.solRegistrationId = :solRegId', {
              solRegId: solRegistrationId,
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
            .andWhere('eval.solRegistrationId = :solRegId', {
              solRegId: solRegistrationId,
            }),
      )
      .getMany();

    return documentaryEvidences;
  }
}

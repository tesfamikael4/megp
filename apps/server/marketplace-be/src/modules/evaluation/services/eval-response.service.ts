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
import { ESolRegistrationStatus, EvaluationResponse } from 'src/utils/enums';
import { REQUEST } from '@nestjs/core';
import { CreateEvalAssessmentDto } from '../dtos/eval-assessment.dto';
import { EvalAssessment } from 'src/entities/eval-assessment.entity';

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
    @InjectRepository(TeamMember)
    private readonly teamMemberRepository: Repository<TeamMember>,
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

    if (!evaluation) throw new BadRequestException('Evaluation not found');

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

  async canBeginTeamAssessemnt(rfxId: string, user: any): Promise<boolean> {
    try {
      const [
        teamMembersCount,
        isTeamLead,
        solRegistrationCount,
        assessmentCount,
      ] = await Promise.all([
        this.teamMemberRepository.count({
          where: {
            rfxId,
          },
        }),
        this.teamMemberRepository.exists({
          where: {
            rfxId,
            isTeamLead: true,
            personnelId: user.userId,
          },
        }),
        this.solRegistrationRepository.count({
          where: {
            rfxId,
            status: ESolRegistrationStatus.REGISTERED,
          },
        }),
        this.evalAssessmentRepository.count({
          where: {
            rfxId,
            isTeamAssessment: false,
          },
        }),
      ]);

      if (!isTeamLead) return false;
      if (assessmentCount != teamMembersCount * solRegistrationCount)
        return false;

      return true;
    } catch (error) {
      return false;
    }
  }

  async canSubmitRfxEvaluation(
    solRegistrationId: string,
    user: any,
  ): Promise<boolean> {
    const [teamMember] = await Promise.all([
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
    ]);

    if (!teamMember) throw new BadRequestException('You are not a team member');

    const solRegistration: any = await this.solRegistrationRepository
      .createQueryBuilder('solRegistrations')
      .where('solRegistrations.id = :solRegistrationId', { solRegistrationId })
      .loadRelationCountAndMap(
        'solRegistrations.totalResponses',
        'solRegistrations.openedResponses',
      )
      .loadRelationCountAndMap(
        'solRegistrations.totalItemResponses',
        'solRegistrations.openedItemResponses',
      )
      .loadRelationCountAndMap(
        'solRegistrations.evaluatedAsessments',
        'solRegistrations.evaluationAssessments',
        'eval',
        (qb) =>
          qb.where('eval.isTeamAssessment = :isTeamAssessment', {
            isTeamAssessment: false,
          }),
      )
      .getOne();

    const totalResponses =
      solRegistration.totalResponses + solRegistration.totalItemResponses;

    if (totalResponses != solRegistration.evaluatedResponses) return false;

    return true;
  }

  async canSubmitVendorEvaluation(
    solRegistrationId: string,
    user: any,
  ): Promise<boolean> {
    const teamMember = await this.teamMemberRepository.findOne({
      where: {
        rfx: {
          solRegistrations: {
            id: solRegistrationId,
          },
        },
        personnelId: user.userId,
      },
    });

    if (!teamMember) throw new BadRequestException('You are not a team member');

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
          qb.where('eval.isTeamAssessment = :isTeamAssessment', {
            isTeamAssessment: false,
          }),
      )
      .loadRelationCountAndMap(
        'solRegistrations.evaluatedItemResponses',
        'solRegistrations.evalItemResponses',
        'evalItem',
        (qb) =>
          qb.where('evalItem.isTeamAssessment = :isTeamAssessment', {
            isTeamAssessment: false,
          }),
      )
      .loadRelationCountAndMap(
        'solRegistrations.totalItemResponses',
        'solRegistrations.openedItemResponses',
      )
      .getOne();

    if (solRegistration.totalResponses != solRegistration.evaluatedResponses)
      return false;

    if (
      solRegistration.totalItemResponses !=
      solRegistration.evaluatedItemResponses
    )
      return false;

    return true;
  }

  async submitVendorEvalitaion(
    solRegistrationId: string,
    isTeamAssessment: boolean,
    user: any,
  ) {
    const [teamMember, solRegistration, alreadyEvaluated] = await Promise.all([
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
    ]);

    if (!teamMember) throw new BadRequestException('You are not a team member');

    if (alreadyEvaluated)
      throw new BadRequestException(
        'You have already completed this evaluation',
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
}

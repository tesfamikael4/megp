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
            isTeamAssesment: false,
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
      'isTeamAssesment',
      'openedResponseId',
    ]);

    return evaluationItem;
  }

  async getEvaluation(
    rfxId: string,
    rfxDocumentaryEvidenceId: string,
    isTeamAssesment: boolean,
    user: any,
  ) {
    const evaluation = await this.evalResponseRepository.findOne({
      where: {
        isTeamAssesment,
        rfxId,
        rfxDocumentaryEvidenceId,
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
            isTeamAssesment: false,
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
      .createQueryBuilder('solRegistration')
      .where('solRegistration.id = :solRegistrationId', { solRegistrationId })
      .loadRelationCountAndMap(
        'solRegistration.totalResponses',
        'solRegistration.openedResponses',
      )
      .loadRelationCountAndMap(
        'solRegistration.evaluatedResponses',
        'solRegistration.evalResponses',
      )
      .loadRelationCountAndMap(
        'solRegistration.evaluatedItemResponses',
        'solRegistration.evalItemResponses',
      )
      .loadRelationCountAndMap(
        'solRegistration.totalItemResponses',
        'solRegistration.openedItemResponses',
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
      .createQueryBuilder('solRegistration')
      .where('solRegistration.id = :solRegistrationId', { solRegistrationId })
      .loadRelationCountAndMap(
        'solRegistration.totalResponses',
        'solRegistration.openedResponses',
      )
      .loadRelationCountAndMap(
        'solRegistration.evaluatedResponses',
        'solRegistration.evalResponses',
      )
      .loadRelationCountAndMap(
        'solRegistration.evaluatedItemResponses',
        'solRegistration.evalItemResponses',
      )
      .loadRelationCountAndMap(
        'solRegistration.totalItemResponses',
        'solRegistration.openedItemResponses',
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
    const [teamMember, solRegistration] = await Promise.all([
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
    ]);

    if (!teamMember) throw new BadRequestException('You are not a team member');

    let doesNotComply = false;
    doesNotComply = solRegistration.evalResponses.some(
      (ev) => ev.qualified === EvaluationResponse.NOT_COMPLY,
    );
    doesNotComply = solRegistration.evalItemResponses.some(
      (ev) => ev.qualified === EvaluationResponse.NOT_COMPLY,
    );

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

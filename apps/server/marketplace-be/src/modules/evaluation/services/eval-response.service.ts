import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraCrudService } from 'megp-shared-be';
import {
  EvalResponse,
  RFX,
  RfxProcurementTechnicalTeam,
  SolRegistration,
} from 'src/entities';
import { Repository } from 'typeorm';
import { CreateEvalResponseDto } from '../dtos/eval-response.dto';
import { ESolRegistrationStatus } from 'src/utils/enums';

@Injectable()
export class EvalResponseService extends ExtraCrudService<EvalResponse> {
  constructor(
    @InjectRepository(EvalResponse)
    private readonly evalResponseRepository: Repository<EvalResponse>,
    @InjectRepository(SolRegistration)
    private readonly solRegistrationRepository: Repository<SolRegistration>,
    @InjectRepository(RfxProcurementTechnicalTeam)
    private readonly rfxProcurementTechnicalTeamRepository: Repository<RfxProcurementTechnicalTeam>,
    @InjectRepository(RFX)
    private readonly rfxRepository: Repository<RFX>,
  ) {
    super(evalResponseRepository);
  }

  async submitEvaluation(rfxId: string) {
    const solRegistration: any = await this.solRegistrationRepository
      .createQueryBuilder('sol_registration')
      .where('sol_registration.rfxId = :rfxId', { rfxId })
      .andWhere('sol_registration.status = :status', {
        status: ESolRegistrationStatus.REGISTERED,
      })
      .loadRelationCountAndMap(
        'sol_registration.totalResponses',
        'sol_registration.openedResponses',
      )
      .loadRelationCountAndMap(
        'sol_registration.evaluatedResponses',
        'sol_registration.evalResponses',
        'evalResponse',
        (qb) =>
          qb.andWhere('evalResponse.isTeamAssesment = :isTeamAssesment', {
            isTeamAssesment: true,
          }),
      )
      .loadRelationCountAndMap(
        'sol_registration.totalItemResponses',
        'sol_registration.openedItemResponses',
      )
      .loadRelationCountAndMap(
        'sol_registration.evaluatedItemResponses',
        'sol_registration.evalItemResponses',
        'evalItemResponse',
        (qb) =>
          qb.andWhere('evalItemResponse.isTeamAssesment = :isTeamAssesment', {
            isTeamAssesment: true,
          }),
      )
      .getMany();

    if (solRegistration.length == 0) {
      throw new BadRequestException('RFQ not found');
    }

    solRegistration.forEach((solRegistration: any) => {
      if (solRegistration.totalResponses !== solRegistration.evaluatedResponses)
        throw new BadRequestException(
          'All responses have been not been evaluated',
        );

      if (
        solRegistration.totalItemResponses !==
        solRegistration.evaluatedItemResponses
      )
        throw new BadRequestException(
          'All responses have been not been evaluated',
        );
    });
  }

  async canSubmitEvaluation(rfxId: string, user: any): Promise<boolean> {
    const [isTeamLead, numberOfEvaluation, numberOfTeamMembers] =
      await Promise.all([
        this.rfxProcurementTechnicalTeamRepository.exists({
          where: {
            rfxId,
            isTeamLead: true,
            userId: user.userId,
          },
        }),
        this.evalResponseRepository.count({
          where: {
            rfxId,
            isTeamAssesment: false,
          },
        }),
        this.rfxProcurementTechnicalTeamRepository.count({
          where: {
            rfxId,
            isTeamLead: false,
          },
        }),
      ]);
    if (!isTeamLead) return false;

    if (numberOfEvaluation != numberOfTeamMembers) return false;

    return true;
  }

  async create(itemData: CreateEvalResponseDto, req?: any) {
    const [isTeamLead, numberOfTeam, evaluationsCount, solRegistration] =
      await Promise.all([
        this.rfxProcurementTechnicalTeamRepository.exists({
          where: {
            rfxId: itemData.rfxId,
            isTeamLead: true,
            userId: req.user.userId,
          },
        }),
        this.rfxProcurementTechnicalTeamRepository.count({
          where: {
            rfxId: itemData.rfxId,
          },
        }),
        this.evalResponseRepository.count({
          where: {
            rfxId: itemData.rfxId,
            solRegistration: {
              vendorId: itemData.vendorId,
            },
          },
        }),
        this.solRegistrationRepository.findOne({
          where: {
            rfxId: itemData.rfxId,
            vendorId: itemData.vendorId,
          },
          select: {
            id: true,
          },
        }),
      ]);

    if (isTeamLead) {
      if (evaluationsCount !== numberOfTeam - 1) {
        throw new BadRequestException(
          'All Team Members Should Evaluate First.',
        );
      }
      itemData.isTeamAssesment = true;
    }

    itemData.evaluatorId = req.user.userId;
    itemData.solRegistrationId = solRegistration.id;
    const evaluationItem = this.evalResponseRepository.create(itemData);
    await this.evalResponseRepository.insert(evaluationItem);
    return evaluationItem;
  }
}

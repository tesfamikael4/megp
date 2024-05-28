import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraCrudService } from 'megp-shared-be';
import {
  EvalItemResponse,
  RFX,
  RfxProcurementTechnicalTeam,
  SolRegistration,
} from 'src/entities';
import { LessThanOrEqual, Repository } from 'typeorm';
import { CreateEvalItemResponseDto } from '../dtos/eval-item-response.dto';

@Injectable()
export class EvalItemResponseService extends ExtraCrudService<EvalItemResponse> {
  constructor(
    @InjectRepository(EvalItemResponse)
    private readonly evalItemResponseRepository: Repository<EvalItemResponse>,
    @InjectRepository(SolRegistration)
    private readonly solRegistrationRepository: Repository<SolRegistration>,
    @InjectRepository(RfxProcurementTechnicalTeam)
    private readonly rfxProcurementTechnicalTeamRepository: Repository<RfxProcurementTechnicalTeam>,
    @InjectRepository(RFX)
    private readonly rfxRepository: Repository<RFX>,
  ) {
    super(evalItemResponseRepository);
  }

  async create(itemData: CreateEvalItemResponseDto, req?: any) {
    const now = new Date(Date.now());
    const rfx = await this.rfxRepository.findOne({
      where: {
        items: {
          id: itemData.rfxItemId,
        },
        rfxBidProcedure: {
          submissionDeadline: LessThanOrEqual(now),
        },
      },
      select: { id: true },
    });
    const [isTeamLead, numberOfTeam, evaluationsCount] = await Promise.all([
      this.rfxProcurementTechnicalTeamRepository.exists({
        where: {
          rfxId: rfx.id,
          isTeamLead: true,
          userId: req.user.userId,
        },
      }),
      this.rfxProcurementTechnicalTeamRepository.count({
        where: {
          rfxId: rfx.id,
        },
      }),
      this.evalItemResponseRepository.count({
        where: {
          rfxItemId: itemData.rfxItemId,
          solRegistration: {
            vendorId: itemData.vendorId,
          },
        },
      }),
    ]);

    if (isTeamLead) {
      if (evaluationsCount !== numberOfTeam - 1) {
        throw new BadRequestException(
          'All Team Members Should Evaluate First.',
        );
      }
      itemData.isTeamAssessment = true;
    }

    const evaluationItem = this.evalItemResponseRepository.create(itemData);
    await this.evalItemResponseRepository.insert(evaluationItem);
    return evaluationItem;
  }
}

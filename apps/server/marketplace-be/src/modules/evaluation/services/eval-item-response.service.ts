import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraCrudService } from 'megp-shared-be';
import {
  EvalItemResponse,
  RFX,
  RfxProcurementTechnicalTeam,
  SolRegistration,
  TeamMember,
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
    @InjectRepository(TeamMember)
    private readonly teamMemberRepository: Repository<TeamMember>,
    @InjectRepository(RFX)
    private readonly rfxRepository: Repository<RFX>,
  ) {
    super(evalItemResponseRepository);
  }

  async create(itemData: CreateEvalItemResponseDto, req?: any) {
    const now = new Date(Date.now());
    const [rfx, teamMember] = await Promise.all([
      this.rfxRepository.exists({
        where: {
          items: {
            id: itemData.rfxItemId,
          },
          rfxBidProcedure: {
            openingDate: LessThanOrEqual(now),
          },
        },
      }),
      this.teamMemberRepository.findOne({
        where: {
          personnelId: req.user.userId,
          rfx: {
            items: {
              id: itemData.rfxItemId,
              rfxProductInvitations: {
                id: itemData.rfxProductInvitaitonId,
              },
            },
          },
        },
      }),
    ]);
    if (!rfx) throw new BadRequestException('RFQ not opened yet');

    if (!teamMember)
      throw new BadRequestException(
        'You are not a team member For evaluation of this RFQ ',
      );

    if (itemData.isTeamAssessment) {
      const [membersCount, evaluationsCount] = await Promise.all([
        this.teamMemberRepository.count({
          where: {
            rfx: {
              items: {
                id: itemData.rfxItemId,
              },
            },
          },
        }),
        this.evalItemResponseRepository.count({
          where: {
            rfxItemId: itemData.rfxItemId,
            rfxProductInvitaitonId: itemData.rfxProductInvitaitonId,
          },
        }),
      ]);

      if (membersCount != evaluationsCount)
        throw new BadRequestException(
          'RFQ Product not evaluated by all team members',
        );
    }

    const evaluationItem = this.evalItemResponseRepository.create(itemData);
    await this.evalItemResponseRepository.upsert(evaluationItem, [
      'teamMemberId',
      'rfxProductInvitaitonId',
      'isTeamAssesment',
    ]);
    return evaluationItem;
  }

  async getTeamMembersEvaluation(
    rfxProductInvitaitonId: string,
    solRegistrationId: string,
    user: any,
  ) {
    const [evaluations, teamLead] = await Promise.all([
      this.evalItemResponseRepository.find({
        where: {
          rfxProductInvitaitonId,
          solRegistrationId,
        },
      }),
      this.teamMemberRepository.findOne({
        where: {
          rfx: {
            items: {
              rfxProductInvitations: {
                id: rfxProductInvitaitonId,
              },
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
}

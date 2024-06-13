import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  Repository,
  EntityManager,
  DeepPartial,
  MoreThan,
  LessThanOrEqual,
} from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { ExtraCrudService, ENTITY_MANAGER_KEY } from 'megp-shared-be';
import {
  RfxRevisionApproval,
  RfxProcurementTechnicalTeam,
  RFX,
  RfxBidProcedure,
} from 'src/entities';
import { CreateRevisionApprovalDto } from '../dtos/rfx-revision-approval.dto';
import { ERfxRevisionApprovalStatusEnum, ERfxStatus } from 'src/utils/enums';

@Injectable()
export class RfxRevisionApprovalService extends ExtraCrudService<RfxRevisionApproval> {
  constructor(
    @InjectRepository(RfxRevisionApproval)
    private readonly revisionApprovalRepository: Repository<RfxRevisionApproval>,
    @Inject(REQUEST) private request: Request,
  ) {
    super(revisionApprovalRepository);
  }

  async create(
    itemData: CreateRevisionApprovalDto,
    user: any,
    req?: any,
  ): Promise<any> {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const team = await manager
      .getRepository(RfxProcurementTechnicalTeam)
      .findOneBy({ userId: user.id });

    //   if(!team)
    //     throw new BadRequestException("User is not a Team Member.")

    // if (team?.isTeamLead) {
    //   throw new BadRequestException('leader cannot approve');
    // }

    const item = manager
      .getRepository(RfxRevisionApproval)
      .create({ ...itemData, userId: user.id });

    await manager.getRepository(RfxRevisionApproval).insert(item);

    if (itemData.status == ERfxRevisionApprovalStatusEnum.ADJUST)
      await manager.getRepository(RFX).update(itemData.rfxId, {
        status: ERfxStatus.ADJUSTEDMENT,
      });

    return item;
  }

  async canSubmit(
    rfxId: string,
    user: any,
  ): Promise<{ canSubmit: boolean; reason?: string }> {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const [
      rfxExists,
      isTeamLead,
      deadlinePassed,
      adjustmentResponseExists,
      teamCount,
      approvalCount,
    ] = await Promise.all([
      manager.getRepository(RFX).exists({
        where: {
          id: rfxId,
          status: ERfxStatus.TEAM_REVIEWAL,
        },
      }),
      manager.getRepository(RfxProcurementTechnicalTeam).exists({
        where: {
          userId: user.userId,
          rfxId,
          isTeamLead: true,
        },
      }),
      manager.getRepository(RfxBidProcedure).exists({
        where: {
          rfxId,
          reviewDeadline: LessThanOrEqual(new Date(Date.now())),
        },
      }),
      manager.getRepository(RfxRevisionApproval).exists({
        where: {
          rfxId,
          status: ERfxRevisionApprovalStatusEnum.ADJUST,
        },
      }),
      manager.getRepository(RfxProcurementTechnicalTeam).count({
        where: {
          rfxId,
        },
      }),
      manager.getRepository(RfxRevisionApproval).count({
        where: {
          rfxId,
          status: ERfxRevisionApprovalStatusEnum.APPROVED,
        },
      }),
    ]);

    if (!rfxExists)
      return {
        canSubmit: false,
        reason: 'RFQ is not approved by team members',
      };
    else if (!isTeamLead)
      return { canSubmit: false, reason: 'User is not a Team Lead' };
    else if (adjustmentResponseExists)
      return {
        canSubmit: false,
        reason: 'RFQ has not been approved by the team',
      };
    else if (!deadlinePassed && teamCount !== approvalCount)
      return {
        canSubmit: false,
        reason: 'All team members have not yet approved',
      };

    return { canSubmit: true };
  }
}

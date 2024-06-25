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
import currentTime from 'src/utils/services/time-provider';

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
      .findOneBy({ userId: user.userId });

    //   if(!team)
    //     throw new BadRequestException("User is not a Team Member.")

    // if (team?.isTeamLead) {
    //   throw new BadRequestException('leader cannot approve');
    // }

    const item = manager
      .getRepository(RfxRevisionApproval)
      .create({ ...itemData, userId: user.userId });

    await manager.getRepository(RfxRevisionApproval).insert(item);

    if (itemData.status == ERfxRevisionApprovalStatusEnum.ADJUST)
      await manager.getRepository(RFX).update(itemData.rfxId, {
        status: ERfxStatus.ADJUSTMENT,
      });

    return item;
  }

  async canSubmit(
    rfxId: string,
    user: any,
  ): Promise<{ canSubmit: boolean; reason?: string }> {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const now = new Date();

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
          reviewDeadline: LessThanOrEqual(now),
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

  async canSubmitToRfxApproval(rfxId: string, user: any) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const [teamMembersCount, isTeamLead, bidProcedure, revisionApprovals] =
      await Promise.all([
        entityManager.getRepository(RfxProcurementTechnicalTeam).count({
          where: {
            rfxId,
          },
        }),
        entityManager.getRepository(RfxProcurementTechnicalTeam).exists({
          where: {
            userId: user.userId,
            rfxId,
            isTeamLead: true,
          },
        }),
        entityManager.getRepository(RfxBidProcedure).findOne({
          where: {
            rfxId,
          },
          select: {
            id: true,
            reviewDeadline: true,
          },
        }),
        entityManager.getRepository(RfxRevisionApproval).find({
          where: {
            rfxId,
          },
          select: {
            id: true,
            status: true,
          },
        }),
      ]);

    if (!isTeamLead)
      return {
        canSubmit: false,
        reason: 'You are not a Technical Team Lead.',
        isTeamLead: false,
      };

    const revisionCount = revisionApprovals.length;
    const adjustResponse = revisionApprovals.some(
      (revision) => revision.status == ERfxRevisionApprovalStatusEnum.ADJUST,
    );

    if (adjustResponse)
      return {
        canSubmit: false,
        reason: 'Prepared RFQ is not Approved by team members.',
        isTeamLead: true,
      };

    const now = new Date();
    if (now < bidProcedure.reviewDeadline && revisionCount < teamMembersCount)
      return {
        canSubmit: false,
        reason: 'Team Members Reviewal Period not ended.',
        isTeamLead: true,
      };

    return { canSubmit: true, isTeamLead: true };
  }
}

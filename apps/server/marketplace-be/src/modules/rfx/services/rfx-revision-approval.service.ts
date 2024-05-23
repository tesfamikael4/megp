import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository, EntityManager, DeepPartial } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { ExtraCrudService, ENTITY_MANAGER_KEY } from 'megp-shared-be';
import {
  RfxRevisionApproval,
  RfxProcurementTechnicalTeam,
  RFX,
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
}

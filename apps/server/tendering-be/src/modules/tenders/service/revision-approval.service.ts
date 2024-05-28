import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository, EntityManager, DeepPartial } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { ExtraCrudService } from 'src/shared/service';
import {
  RevisionApproval,
  ProcurementTechnicalTeam,
  Tender,
} from 'src/entities';
import { TenderStatusEnum } from 'src/shared/enums/tender-status.enum';

@Injectable()
export class RevisionApprovalService extends ExtraCrudService<RevisionApproval> {
  constructor(
    @InjectRepository(RevisionApproval)
    private readonly revisionApprovalRepository: Repository<RevisionApproval>,
    @Inject(REQUEST) private request: Request,
  ) {
    super(revisionApprovalRepository);
  }

  async create(itemData: DeepPartial<any>, req?: any): Promise<any> {
    if (!req?.user?.id) {
      throw new NotFoundException(`not_found`);
    }

    try {
      const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
      const team = await manager
        .getRepository(ProcurementTechnicalTeam)
        .findOneBy({ userId: req?.user?.id });

      if (team.isTeamLead) {
        throw new BadRequestException('leader_cannot_approve');
      }

      const item = manager
        .getRepository(RevisionApproval)
        .create([{ ...itemData, userId: req?.user?.id }]) as any;
      await manager
        .getRepository(RevisionApproval)
        .upsert(item, ['tenderId', 'userId']);

      const [teams, revisedTeamCount] = await Promise.all([
        manager.getRepository(ProcurementTechnicalTeam).countBy({
          tenderId: itemData.tenderId,
        }),
        await manager.getRepository(RevisionApproval).countBy({
          tenderId: itemData.tenderId,
        }),
      ]);
      if (teams - 1 == revisedTeamCount) {
        await manager.getRepository(Tender).update(itemData.tenderId, {
          status: TenderStatusEnum.REVIEWED,
        });
      }

      return item;
    } catch (e) {
      throw e;
    }
  }
}

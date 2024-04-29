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
import { RevisionApproval, ProcurementTechnicalTeam } from 'src/entities';

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

      return item;
    } catch (e) {
      throw e;
    }
  }
}

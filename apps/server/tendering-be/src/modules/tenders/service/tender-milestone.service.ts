import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { TenderMilestone } from 'src/entities/tender-milestone.entity';
import {
  MilestoneLabels,
  TenderMilestoneEnum,
} from 'src/shared/enums/tender-milestone.enum';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';

@Injectable()
export class TenderMilestoneService extends ExtraCrudService<TenderMilestone> {
  constructor(
    @InjectRepository(TenderMilestone)
    private readonly tenderMilestoneRepository: Repository<TenderMilestone>,

    private readonly request: Request,
  ) {
    super(tenderMilestoneRepository);
  }
  async changeMilestone(itemData: {
    lotId: string;
    tenderId: string;
    milestone: TenderMilestoneEnum;
  }) {
    const manager = this.request[ENTITY_MANAGER_KEY];
    await manager.getRepository(TenderMilestone).update(
      {
        lotId: itemData.lotId,
        tenderId: itemData.tenderId,
      },
      {
        isCurrent: false,
      },
    );
    const milestoneData = {
      lotId: itemData.lotId,
      tenderId: itemData.tenderId,
      milestoneNum: itemData.milestone,
      milestoneTxt: MilestoneLabels[itemData.milestone],
      isCurrent: true,
    };

    await manager.getRepository(TenderMilestone).insert(milestoneData);
  }
}

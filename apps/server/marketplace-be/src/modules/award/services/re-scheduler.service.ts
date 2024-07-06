import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraCrudService } from 'megp-shared-be';
import { AwardItem, AwardNote } from 'src/entities';
import { DataSource, MoreThanOrEqual, Repository } from 'typeorm';
import { AwardItemService } from './award-item.service';
import { SchedulerService } from 'src/utils/services/scheduler.service';
import { EAwardItemStatus } from 'src/utils/enums/award.enum';

@Injectable()
export class ReSchedulerService implements OnModuleInit {
  constructor(
    @InjectRepository(AwardItem)
    private readonly awardItemRepository: Repository<AwardItem>,
    private readonly schedulerService: SchedulerService,
  ) {}

  async onModuleInit() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const pendingAwards = await this.awardItemRepository.find({
      where: {
        status: EAwardItemStatus.PENDING,
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    const expiredAwards = [];
    for (const awardItem of pendingAwards) {
      if (awardItem.createdAt < yesterday) {
        expiredAwards.push(awardItem);
        continue;
      }
      const createdDate = new Date();
      createdDate.setDate(createdDate.getDate() + 1);

      const end = new Date(createdDate);

      const payload = { awardItemId: awardItem.id };

      await this.schedulerService.schedule(
        this.cancelUnAcceptedAward,
        end,
        payload,
      );
    }
    if (expiredAwards.length > 0) {
      await this.awardItemRepository.update(expiredAwards, {
        status: EAwardItemStatus.CANCELLED,
      });
    }
  }

  async cancelUnAcceptedAward(
    dataSource: DataSource,
    payload: { awardItemId: string },
  ) {
    const awardItemRepo = dataSource.getRepository(AwardItem);
    const unacceptedAwardItem = await awardItemRepo.exists({
      where: {
        id: payload.awardItemId,
        status: EAwardItemStatus.PENDING,
      },
    });

    if (unacceptedAwardItem) {
      await awardItemRepo.update(payload.awardItemId, {
        status: EAwardItemStatus.CANCELLED,
      });
    }
  }
}

import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  PostBudgetPlanActivity,
  PostBudgetPlanItem,
  PreBudgetPlanItems,
} from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { BulkItemsDto } from 'src/modules/planning/dtos/pre-budget-plan-items.dto';

@Injectable()
export class PostBudgetPlanItemService extends ExtraCrudService<PostBudgetPlanItem> {
  constructor(
    @InjectRepository(PostBudgetPlanItem)
    private readonly repositoryPostBudgetPlanItems: Repository<PostBudgetPlanItem>,
    @InjectRepository(PostBudgetPlanActivity)
    private readonly repositoryPostBudgetPlanActivity: Repository<PostBudgetPlanActivity>,
  ) {
    super(repositoryPostBudgetPlanItems);
  }

  async create(
    itemData: PostBudgetPlanItem,
    req: any,
  ): Promise<PostBudgetPlanItem> {
    if (req?.user?.organization) {
      itemData.organizationId = req.user.organization.id;
    }
    const item = this.repositoryPostBudgetPlanItems.create(itemData);
    await this.repositoryPostBudgetPlanItems.save(item);

    const activities = await this.repositoryPostBudgetPlanActivity.findOne({
      where: { id: item.postBudgetPlanActivityId },
    });
    activities.calculatedAmount += item.unitPrice * item.quantity;

    await this.repositoryPostBudgetPlanActivity.update(
      activities.id,
      activities,
    );

    return item;
  }

  async bulkCreate(
    itemData: BulkItemsDto,
    organizationId,
  ): Promise<BulkItemsDto> {
    itemData.items.forEach((item) => {
      item.organizationId = organizationId;
    });
    const items = this.repositoryPostBudgetPlanItems.create(
      itemData.items as any,
    );
    await this.repositoryPostBudgetPlanItems.save(items);

    const activity = await this.repositoryPostBudgetPlanActivity.findOne({
      where: { id: itemData.items[0].preBudgetPlanActivityId },
    });

    for (const item of items) {
      activity.calculatedAmount += item.unitPrice * item.quantity;
    }

    if (activity.calculatedAmount > activity.estimatedAmount) {
      throw new HttpException(
        'calculated  amount is greater than estimated amount',
        430,
      );
    }

    await this.repositoryPostBudgetPlanActivity.update(activity.id, activity);

    return itemData;
  }

  async update(
    id: string,
    itemData: any,
  ): Promise<PostBudgetPlanItem | undefined> {
    const item = await this.repositoryPostBudgetPlanItems.findOneOrFail({
      where: { id: id },
    });
    const activity = await this.repositoryPostBudgetPlanActivity.findOne({
      where: { id: item.postBudgetPlanActivityId },
    });

    const preAmount = item.quantity * item.unitPrice;
    const currentAmount = itemData.quantity * itemData.unitPrice;

    activity.calculatedAmount -= preAmount - currentAmount;

    await this.repositoryPostBudgetPlanActivity.update(activity.id, activity);

    if (activity.calculatedAmount > activity.estimatedAmount) {
      throw new HttpException(
        'calculated amount is greater than estimated amount',
        430,
      );
    }

    await this.repositoryPostBudgetPlanItems.update(id, itemData);
    return this.repositoryPostBudgetPlanItems.findOne({ where: { id: id } });
  }

  async remove(id: string): Promise<void> {
    const item = await this.repositoryPostBudgetPlanItems.findOneOrFail({
      where: { id: id },
    });
    const activity = await this.repositoryPostBudgetPlanActivity.findOne({
      where: { id: item.postBudgetPlanActivityId },
    });
    activity.calculatedAmount -= item.unitPrice * item.quantity;

    if (activity.calculatedAmount > activity.estimatedAmount) {
      throw new HttpException(
        'calculated amount is greater than estimated amount',
        430,
      );
    }
    await this.repositoryPostBudgetPlanActivity.update(activity.id, activity);
    await this.repositoryPostBudgetPlanItems.delete(id);
  }
}

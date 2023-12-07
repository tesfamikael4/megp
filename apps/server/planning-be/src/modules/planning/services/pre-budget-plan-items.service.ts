import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PreBudgetPlanActivity, PreBudgetPlanItems } from 'src/entities';
import { BulkItemsDto } from '../dtos/pre-budget-plan-items.dto';
import { ExtraCrudService } from 'src/shared/service';

@Injectable()
export class PreBudgetPlanItemsService extends ExtraCrudService<PreBudgetPlanItems> {
  constructor(
    @InjectRepository(PreBudgetPlanItems)
    private readonly repositoryPreBudgetPlanItems: Repository<PreBudgetPlanItems>,
    @InjectRepository(PreBudgetPlanActivity)
    private readonly repositoryPreBudgetPlanActivity: Repository<PreBudgetPlanActivity>,
  ) {
    super(repositoryPreBudgetPlanItems);
  }

  async create(itemData: PreBudgetPlanItems): Promise<PreBudgetPlanItems> {
    const item = this.repositoryPreBudgetPlanItems.create(itemData);
    await this.repositoryPreBudgetPlanItems.save(item);

    const activities = await this.repositoryPreBudgetPlanActivity.findOne({
      where: { id: item.preBudgetPlanActivityId },
    });
    activities.calculatedAmount += item.unitPrice * item.quantity;

    await this.repositoryPreBudgetPlanActivity.update(
      activities.id,
      activities,
    );

    return item;
  }

  async bulkCreate(itemData: BulkItemsDto): Promise<BulkItemsDto> {
    const items = this.repositoryPreBudgetPlanItems.create(
      itemData.items as any,
    );
    await this.repositoryPreBudgetPlanItems.save(items);

    const activity = await this.repositoryPreBudgetPlanActivity.findOne({
      where: { id: itemData.items[0].preBudgetPlanActivityId },
    });

    for (const item of items) {
      activity.calculatedAmount += item.unitPrice * item.quantity;
    }

    await this.repositoryPreBudgetPlanActivity.update(activity.id, activity);

    return itemData;
  }

  async update(
    id: string,
    itemData: any,
  ): Promise<PreBudgetPlanItems | undefined> {
    const item = await this.repositoryPreBudgetPlanItems.findOneOrFail({
      where: { id: id },
    });
    const activities = await this.repositoryPreBudgetPlanActivity.findOne({
      where: { id: item.preBudgetPlanActivityId },
    });

    const preAmount = item.quantity * item.unitPrice;
    const currentAmount = itemData.quantity * itemData.unitPrice;

    activities.calculatedAmount -= preAmount - currentAmount;

    await this.repositoryPreBudgetPlanActivity.update(
      activities.id,
      activities,
    );
    await this.repositoryPreBudgetPlanItems.update(id, itemData);
    return this.repositoryPreBudgetPlanItems.findOne({ where: { id: id } });
  }

  async remove(id: string): Promise<void> {
    const item = await this.repositoryPreBudgetPlanItems.findOneOrFail({
      where: { id: id },
    });
    const activities = await this.repositoryPreBudgetPlanActivity.findOne({
      where: { id: item.preBudgetPlanActivityId },
    });
    activities.calculatedAmount -= item.unitPrice * item.quantity;

    await this.repositoryPreBudgetPlanActivity.update(
      activities.id,
      activities,
    );
    await this.repositoryPreBudgetPlanItems.delete(id);
  }
}

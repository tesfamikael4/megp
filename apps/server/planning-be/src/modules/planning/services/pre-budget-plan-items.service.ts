import { InjectRepository } from '@nestjs/typeorm';
import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { PreBudgetPlanActivity, PreBudgetPlanItems } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { BulkItemsDto } from '../dtos/pre-budget-plan-items.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PreBudgetPlanItemsService extends ExtraCrudService<PreBudgetPlanItems> {
  constructor(
    @InjectRepository(PreBudgetPlanItems)
    private readonly repositoryPreBudgetPlanItems: Repository<PreBudgetPlanItems>,
    @InjectRepository(PreBudgetPlanActivity)
    private readonly repositoryPreBudgetPlanActivity: Repository<PreBudgetPlanActivity>,
    private eventEmitter: EventEmitter2,
  ) {
    super(repositoryPreBudgetPlanItems);
  }

  async create(
    itemData: PreBudgetPlanItems,
    req: any,
  ): Promise<PreBudgetPlanItems> {
    if (req?.user?.organization) {
      itemData.organizationId = req.user.organization.id;
    }
    const activity = await this.repositoryPreBudgetPlanActivity.findOne({
      where: { id: itemData.id },
    });

    const psedoCalculated =
      Number(activity.calculatedAmount) +
      itemData.unitPrice * itemData.quantity;

    if (Number(activity.estimatedAmount) < Number(psedoCalculated))
      throw new ForbiddenException(
        'total calculated amount of items must be lesser than or equal to the activities estimated amount.',
      );

    const item = this.repositoryPreBudgetPlanItems.create(itemData);
    await this.repositoryPreBudgetPlanItems.save(item);

    this.eventEmitter.emit('pre.recalculateCalculatedAmountActivity', {
      preBudgetPlanActivityId: itemData.preBudgetPlanActivityId,
    });
    // const activities = await this.repositoryPreBudgetPlanActivity.findOne({
    //   where: { id: item.preBudgetPlanActivityId },
    // });

    // activities.calculatedAmount += item.unitPrice * item.quantity;

    // await this.repositoryPreBudgetPlanActivity.update(
    //   activities.id,
    //   activities,
    // );

    return item;
  }

  async bulkCreate(itemData: BulkItemsDto, req: any): Promise<BulkItemsDto> {
    if (req?.user?.organization) {
      itemData.items.map((item) => {
        item.organizationId = req.user.organization.id;
      });
    }

    const activity = await this.repositoryPreBudgetPlanActivity.findOne({
      where: {
        id: itemData.items[0].preBudgetPlanActivityId,
      },
    });

    const bulkCalculated = itemData.items.reduce(
      (acc, curr) => acc + curr.quantity * curr.unitPrice,
      0,
    );

    const psedoCalculated =
      Number(bulkCalculated) + Number(activity.calculatedAmount);

    if (Number(activity.estimatedAmount) < psedoCalculated)
      throw new ForbiddenException(
        'total calculated amount of items must be lesser than or equal to the activities estimated amount.',
      );

    const items = this.repositoryPreBudgetPlanItems.create(
      itemData.items as any,
    );
    await this.repositoryPreBudgetPlanItems.save(items);

    this.eventEmitter.emit('pre.recalculateCalculatedAmountActivity', {
      preBudgetPlanActivityId: itemData.items[0].preBudgetPlanActivityId,
    });
    // const activity = await this.repositoryPreBudgetPlanActivity.findOne({
    //   where: { id: itemData.items[0].preBudgetPlanActivityId },
    // });

    // for (const item of items) {
    //   activity.calculatedAmount += item.unitPrice * item.quantity;
    // }

    // if (activity.calculatedAmount > activity.estimatedAmount) {
    //   throw new HttpException(
    //     'calculatedAmount is greater than estimatedAmount',
    //     430,
    //   );
    // }

    // await this.repositoryPreBudgetPlanActivity.update(activity.id, activity);

    return itemData;
  }

  async update(
    id: string,
    itemData: any,
  ): Promise<PreBudgetPlanItems | undefined> {
    const item = await this.repositoryPreBudgetPlanItems.findOneOrFail({
      where: { id: id },
    });

    const activity = await this.repositoryPreBudgetPlanActivity.findOne({
      where: { id: itemData.id },
    });

    const itemNewCalculated = itemData.quantity * itemData.unitPrice;
    const itemOldCalculated = item.quantity * item.unitPrice;
    const psedoCalculated =
      Number(activity.calculatedAmount) + itemNewCalculated - itemOldCalculated;

    if (Number(activity.estimatedAmount) < Number(psedoCalculated))
      throw new ForbiddenException(
        'total calculated amount of items must be lesser than or equal to the activities estimated amount.',
      );

    await this.repositoryPreBudgetPlanItems.update(id, itemData);

    this.eventEmitter.emit('pre.recalculateCalculatedAmountActivity', {
      preBudgetPlanActivityId: item.preBudgetPlanActivityId,
    });

    return this.repositoryPreBudgetPlanItems.findOne({ where: { id: id } });

    // const activity = await this.repositoryPreBudgetPlanActivity.findOne({
    //   where: { id: item.preBudgetPlanActivityId },
    // });

    // const preAmount = item.quantity * item.unitPrice;
    // const currentAmount = itemData.quantity * itemData.unitPrice;

    // activity.calculatedAmount -= preAmount - currentAmount;

    // if (activity.calculatedAmount > activity.estimatedAmount) {
    //   throw new HttpException(
    //     'calculatedAmount is greater than estimatedAmount',
    //     430,
    //   );
    // }

    // await this.repositoryPreBudgetPlanActivity.update(activity.id, activity);
  }

  async softDelete(id: string): Promise<void> {
    const item = await this.repositoryPreBudgetPlanItems.findOneOrFail({
      where: { id: id },
    });
    await this.repositoryPreBudgetPlanItems.softRemove(item);

    this.eventEmitter.emit('pre.recalculateCalculatedAmountActivity', {
      preBudgetPlanActivityId: item.preBudgetPlanActivityId,
    });
    // const activity = await this.repositoryPreBudgetPlanActivity.findOne({
    //   where: { id: item.preBudgetPlanActivityId },
    // });
    // activity.calculatedAmount -= item.unitPrice * item.quantity;

    // if (activity.calculatedAmount > activity.estimatedAmount) {
    //   throw new HttpException(
    //     'calculatedAmount is greater than estimatedAmount',
    //     430,
    //   );
    // }

    // await this.repositoryPreBudgetPlanActivity.update(activity.id, activity);
  }

  async recalculateCalculatedAmounty(preBudgetPlanActivityId) {
    const activity = await this.repositoryPreBudgetPlanActivity.findOne({
      where: {
        id: preBudgetPlanActivityId,
      },
      relations: ['preBudgetPlanItems'],
    });

    if (!activity)
      throw new NotFoundException(`PreBudgetPlanActivity not found`);

    const totalCalculatedAmount = activity.preBudgetPlanItems.reduce(
      (acc, cur) => acc + cur.quantity * cur.unitPrice,
      0,
    );

    await this.repositoryPreBudgetPlanActivity.update(activity.id, {
      calculatedAmount: totalCalculatedAmount,
    });
  }

  codeGenerate() {
    const randomNum = Math.floor(1000000 + Math.random() * 9000000); // Generates a random 5-digit number
    return 'REF-' + randomNum.toString();
  }
}

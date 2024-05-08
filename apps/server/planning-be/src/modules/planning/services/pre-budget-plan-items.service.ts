import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  PostBudgetPlanActivity,
  PostBudgetPlanItem,
  PreBudgetPlanActivity,
  PreBudgetPlanItems,
} from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { BulkItemsDto } from '../dtos/pre-budget-plan-items.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PostBudgetPlanActivityService } from 'src/modules/post-budget-plan/services/post-budget-plan-activity.service';
import { PostBudgetPlanItemService } from 'src/modules/post-budget-plan/services/post-budget-plan-items.service';

@Injectable()
export class PreBudgetPlanItemsService extends ExtraCrudService<PreBudgetPlanItems> {
  constructor(
    @InjectRepository(PreBudgetPlanItems)
    private readonly repositoryPreBudgetPlanItems: Repository<PreBudgetPlanItems>,
    @InjectRepository(PreBudgetPlanActivity)
    private readonly repositoryPreBudgetPlanActivity: Repository<PreBudgetPlanActivity>,

    private postBudgetActivityService: PostBudgetPlanActivityService,
    private postBudgetItemService: PostBudgetPlanItemService,
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
      where: { id: itemData.preBudgetPlanActivityId },
    });

    const psedoCalculated =
      Number(activity.calculatedAmount) +
      itemData.unitPrice * itemData.quantity;

    if (Number(activity.estimatedAmount) < Number(psedoCalculated)) {
      // this.eventEmitter.emit('pre.recalculateCalculatedAmountActivity', {
      //   preBudgetPlanActivityId: itemData.preBudgetPlanActivityId,
      //   type: 'pre',
      // });
      await this.recalculateCalculatedAmount(
        itemData.preBudgetPlanActivityId,
        'pre',
      );

      throw new HttpException(
        'calculated amount is greater than estimated amount',
        430,
      );
    }
    const item = this.repositoryPreBudgetPlanItems.create(itemData);
    await this.repositoryPreBudgetPlanItems.save(item);

    // this.eventEmitter.emit('pre.recalculateCalculatedAmountActivity', {
    //   preBudgetPlanActivityId: itemData.preBudgetPlanActivityId,
    //   type: 'pre',
    // });
    await this.recalculateCalculatedAmount(
      itemData.preBudgetPlanActivityId,
      'pre',
    );

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

    if (Number(activity.estimatedAmount) < psedoCalculated) {
      // this.eventEmitter.emit('pre.recalculateCalculatedAmountActivity', {
      //   preBudgetPlanActivityId: itemData.items[0].preBudgetPlanActivityId,
      //   type: 'pre',
      // });
      await this.recalculateCalculatedAmount(
        itemData.items[0].preBudgetPlanActivityId,
        'pre',
      );

      throw new HttpException(
        'calculated amount is greater than estimated amount',
        430,
      );
    }

    const items = this.repositoryPreBudgetPlanItems.create(
      itemData.items as any,
    );
    await this.repositoryPreBudgetPlanItems.save(items);

    // this.eventEmitter.emit('pre.recalculateCalculatedAmountActivity', {
    //   preBudgetPlanActivityId: itemData.items[0].preBudgetPlanActivityId,
    //   type: 'pre',
    // });
    await this.recalculateCalculatedAmount(
      itemData.items[0].preBudgetPlanActivityId,
      'pre',
    );
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
      where: { id: itemData.preBudgetPlanActivityId },
    });

    const itemNewCalculated = itemData.quantity * itemData.unitPrice;
    const itemOldCalculated = item.quantity * item.unitPrice;
    const psedoCalculated =
      Number(activity.calculatedAmount) + itemNewCalculated - itemOldCalculated;

    if (Number(activity.estimatedAmount) < Number(psedoCalculated)) {
      // this.eventEmitter.emit('pre.recalculateCalculatedAmountActivity', {
      //   preBudgetPlanActivityId: itemData.preBudgetPlanActivityId,
      //   type: 'pre',
      // });
      await this.recalculateCalculatedAmount(
        itemData.preBudgetPlanActivityId,
        'pre',
      );

      throw new HttpException(
        'calculated amount is greater than estimated amount',
        430,
      );
    }

    await this.repositoryPreBudgetPlanItems.update(id, itemData);

    // this.eventEmitter.emit('pre.recalculateCalculatedAmountActivity', {
    //   preBudgetPlanActivityId: item.preBudgetPlanActivityId,
    //   type: 'pre',
    // });
    await this.recalculateCalculatedAmount(item.preBudgetPlanActivityId, 'pre');

    return this.repositoryPreBudgetPlanItems.findOne({ where: { id: id } });
  }

  async softDelete(id: string): Promise<void> {
    const item = await this.repositoryPreBudgetPlanItems.findOneOrFail({
      where: { id: id },
    });
    await this.repositoryPreBudgetPlanItems.softRemove(item);

    // this.eventEmitter.emit('pre.recalculateCalculatedAmountActivity', {
    //   preBudgetPlanActivityId: item.preBudgetPlanActivityId,
    //   type: 'pre',
    // });
    await this.recalculateCalculatedAmount(item.preBudgetPlanActivityId, 'pre');
  }

  async recalculateCalculatedAmount(activityId, type) {
    let activity: any = {};
    if (type == 'pre') {
      const act = await this.repositoryPreBudgetPlanActivity.findOne({
        where: {
          id: activityId,
        },
        relations: {
          preBudgetPlanItems: true,
        },
      });
      activity = { ...act };
    } else {
      const act =
        await this.postBudgetActivityService.findByActivityId(activityId);
      activity = { ...act };
    }
    const activityRepo =
      type == 'pre'
        ? this.repositoryPreBudgetPlanActivity
        : this.postBudgetActivityService;

    if (!activity)
      throw new NotFoundException(`${type}BudgetPlanActivity not found`);

    const items =
      type == 'pre'
        ? activity.preBudgetPlanItems
        : activity.postBudgetPlanItems;
    const totalCalculatedAmount = items.reduce(
      (acc, cur) => acc + cur.quantity * cur.unitPrice,
      0,
    );

    await activityRepo.update(activity.id, {
      calculatedAmount: totalCalculatedAmount,
    });
  }

  codeGenerate() {
    const randomNum = Math.floor(1000000 + Math.random() * 9000000); // Generates a random 5-digit number
    return 'REF-' + randomNum.toString();
  }
}

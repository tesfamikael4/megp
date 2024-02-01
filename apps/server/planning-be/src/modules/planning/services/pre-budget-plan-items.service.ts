import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
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
      where: { id: itemData.preBudgetPlanActivityId },
    });

    const psedoCalculated =
      Number(activity.calculatedAmount) +
      itemData.unitPrice * itemData.quantity;

    if (Number(activity.estimatedAmount) < Number(psedoCalculated)) {
      this.eventEmitter.emit('pre.recalculateCalculatedAmountActivity', {
        preBudgetPlanActivityId: itemData.preBudgetPlanActivityId,
      });
      throw new HttpException(
        'calculatedAmount is greater than estimatedAmount',
        430,
      );
    }
    const item = this.repositoryPreBudgetPlanItems.create(itemData);
    await this.repositoryPreBudgetPlanItems.save(item);

    this.eventEmitter.emit('pre.recalculateCalculatedAmountActivity', {
      preBudgetPlanActivityId: itemData.preBudgetPlanActivityId,
    });

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
      this.eventEmitter.emit('pre.recalculateCalculatedAmountActivity', {
        preBudgetPlanActivityId: itemData.items[0].preBudgetPlanActivityId,
      });
      throw new HttpException(
        'calculatedAmount is greater than estimatedAmount',
        430,
      );
    }

    const items = this.repositoryPreBudgetPlanItems.create(
      itemData.items as any,
    );
    await this.repositoryPreBudgetPlanItems.save(items);

    this.eventEmitter.emit('pre.recalculateCalculatedAmountActivity', {
      preBudgetPlanActivityId: itemData.items[0].preBudgetPlanActivityId,
    });
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
      this.eventEmitter.emit('pre.recalculateCalculatedAmountActivity', {
        preBudgetPlanActivityId: itemData.preBudgetPlanActivityId,
      });
      throw new HttpException(
        'calculatedAmount is greater than estimatedAmount',
        430,
      );
    }

    await this.repositoryPreBudgetPlanItems.update(id, itemData);

    this.eventEmitter.emit('pre.recalculateCalculatedAmountActivity', {
      preBudgetPlanActivityId: item.preBudgetPlanActivityId,
    });

    return this.repositoryPreBudgetPlanItems.findOne({ where: { id: id } });
  }

  async softDelete(id: string): Promise<void> {
    const item = await this.repositoryPreBudgetPlanItems.findOneOrFail({
      where: { id: id },
    });
    await this.repositoryPreBudgetPlanItems.softRemove(item);

    this.eventEmitter.emit('pre.recalculateCalculatedAmountActivity', {
      preBudgetPlanActivityId: item.preBudgetPlanActivityId,
    });
  }

  async recalculateCalculatedAmount(preBudgetPlanActivityId) {
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

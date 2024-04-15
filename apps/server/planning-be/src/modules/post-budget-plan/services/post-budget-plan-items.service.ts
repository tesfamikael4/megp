import { InjectRepository } from '@nestjs/typeorm';
import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { PostBudgetPlanActivity, PostBudgetPlanItem } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { REQUEST } from '@nestjs/core';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';

@Injectable()
export class PostBudgetPlanItemService extends ExtraCrudService<PostBudgetPlanItem> {
  constructor(
    @InjectRepository(PostBudgetPlanItem)
    private readonly repositoryPostBudgetPlanItems: Repository<PostBudgetPlanItem>,
    @InjectRepository(PostBudgetPlanActivity)
    private readonly repositoryPostBudgetPlanActivity: Repository<PostBudgetPlanActivity>,
    private eventEmitter: EventEmitter2,

    @Inject(REQUEST)
    private readonly request: Request,
  ) {
    super(repositoryPostBudgetPlanItems);
  }

  async create(
    itemData: PostBudgetPlanItem,
    req: any,
  ): Promise<PostBudgetPlanItem> {
    if (req?.user?.organization) {
      itemData.organizationId = req.user.organization.id;
      itemData.organizationName = req.user.organization.name;
    }
    const activity = await this.repositoryPostBudgetPlanActivity.findOne({
      where: { id: itemData.postBudgetPlanActivityId },
    });

    const psedoCalculated =
      Number(activity.calculatedAmount) +
      itemData.unitPrice * itemData.quantity;

    if (Number(activity.estimatedAmount) < Number(psedoCalculated)) {
      this.eventEmitter.emit('post.recalculateCalculatedAmountActivity', {
        postBudgetPlanActivityId: itemData.postBudgetPlanActivityId,
      });
      throw new HttpException(
        'calculated amount is greater than estimated amount',
        430,
      );
    }
    const item = this.repositoryPostBudgetPlanItems.create(itemData);
    await this.repositoryPostBudgetPlanItems.save(item);

    this.eventEmitter.emit('post.recalculateCalculatedAmountActivity', {
      postBudgetPlanActivityId: itemData.postBudgetPlanActivityId,
    });

    return item;
  }

  async bulkCreate(itemData: any, organization: any): Promise<any> {
    itemData.items.map((item) => {
      item.organizationId = organization.id;
      item.organizationName = organization.name;
    });

    const activity = await this.repositoryPostBudgetPlanActivity.findOne({
      where: {
        id: itemData.items[0].postBudgetPlanActivityId,
      },
    });

    const bulkCalculated = itemData.items.reduce(
      (acc, curr) => acc + curr.quantity * curr.unitPrice,
      0,
    );

    const psedoCalculated =
      Number(bulkCalculated) + Number(activity.calculatedAmount);

    if (Number(activity.estimatedAmount) < psedoCalculated) {
      this.eventEmitter.emit('post.recalculateCalculatedAmountActivity', {
        postBudgetPlanActivityId: itemData.items[0].postBudgetPlanActivityId,
      });
      throw new HttpException(
        'calculated amount is greater than estimated amount',
        430,
      );
    }

    const items = this.repositoryPostBudgetPlanItems.create(
      itemData.items as any,
    );
    await this.repositoryPostBudgetPlanItems.save(items);

    this.eventEmitter.emit('post.recalculateCalculatedAmountActivity', {
      postBudgetPlanActivityId: itemData.items[0].postBudgetPlanActivityId,
    });
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
      where: { id: itemData.postBudgetPlanActivityId },
    });

    const itemNewCalculated = itemData.quantity * itemData.unitPrice;
    const itemOldCalculated = item.quantity * item.unitPrice;
    const psedoCalculated =
      Number(activity.calculatedAmount) + itemNewCalculated - itemOldCalculated;

    if (Number(activity.estimatedAmount) < Number(psedoCalculated)) {
      this.eventEmitter.emit('post.recalculateCalculatedAmountActivity', {
        postBudgetPlanActivityId: itemData.postBudgetPlanActivityId,
      });
      throw new HttpException(
        'calculated amount is greater than estimated amount',
        430,
      );
    }

    await this.repositoryPostBudgetPlanItems.update(id, itemData);

    this.eventEmitter.emit('post.recalculateCalculatedAmountActivity', {
      postBudgetPlanActivityId: item.postBudgetPlanActivityId,
    });

    return this.repositoryPostBudgetPlanItems.findOne({ where: { id: id } });
  }

  async softDelete(id: string): Promise<void> {
    const item = await this.repositoryPostBudgetPlanItems.findOneOrFail({
      where: { id: id },
    });
    await this.repositoryPostBudgetPlanItems.softRemove(item);

    this.eventEmitter.emit('post.recalculateCalculatedAmountActivity', {
      postBudgetPlanActivityId: item.postBudgetPlanActivityId,
    });
  }

  async recalculateCalculatedAmount(postBudgetPlanActivityId) {
    const activity = await this.repositoryPostBudgetPlanActivity.findOne({
      where: {
        id: postBudgetPlanActivityId,
      },
      relations: ['postBudgetPlanItems'],
    });

    if (!activity)
      throw new NotFoundException(`PostBudgetPlanActivity not found`);

    const totalCalculatedAmount = activity.postBudgetPlanItems.reduce(
      (acc, cur) => acc + cur.quantity * cur.unitPrice,
      0,
    );

    await this.repositoryPostBudgetPlanActivity.update(activity.id, {
      calculatedAmount: totalCalculatedAmount,
    });
  }

  codeGenerate() {
    const randomNum = Math.floor(1000000 + Math.random() * 9000000); // Generates a random 5-digit number
    return 'REF-' + randomNum.toString();
  }

  async getConsolidateItems(postBudgetPlanId: string) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const items = await entityManager
      .getRepository(PostBudgetPlanItem)
      .createQueryBuilder('post_budget_plan_items')
      .select([
        'post_budget_plan_items.description',
        'post_budget_plan_items.itemCode',
      ])
      .addSelect(
        'SUM(CAST(post_budget_plan_items.quantity AS DECIMAL))',
        'totalQuantity',
      ) // Cast quantity to decimal for proper summation
      .where('post_budget_plan_items.itemCode != :itemCode', {
        itemCode: 'custom',
      })
      .groupBy('post_budget_plan_items.description')
      .addGroupBy('post_budget_plan_items.itemCode')
      .getRawMany();
    return items;
  }

  async getByItemCode(itemCode: string) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    return await entityManager.getRepository(PostBudgetPlanItem).find({
      where: {
        itemCode,
      },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ProcurementRequisition,
  ProcurementRequisitionItem,
} from 'src/entities';
import { decodeCollectionQuery } from 'src/shared/collection-query';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';
import {
  CreateProcurementRequisitionItemDto,
  ProcurementRequisitionItemResponseDto,
} from '../dto/procurement-requisition-item.dto';
import { CreateProcurementRequisitionItemReferenceDto } from '../dto/procurement-requisition-item-reference.dto';

const extraCrudOptions = {
  entityIdName: 'procurementRequisitionId',
};
@Injectable()
export class ProcurementRequisitionItemService extends ExtraCrudService<ProcurementRequisitionItem> {
  constructor(
    @InjectRepository(ProcurementRequisitionItem)
    private readonly repositoryProcurementRequisitionItem: Repository<ProcurementRequisitionItem>,

    @InjectRepository(ProcurementRequisition)
    private readonly repositoryProcurementRequisition: Repository<ProcurementRequisition>,

    private readonly eventEmitter: EventEmitter2,
  ) {
    super(repositoryProcurementRequisitionItem);
  }
  @OnEvent('create.pr_items', { async: true })
  async handleItemsCreatedEvent(itemsData: any[]): Promise<void> {
    const mergeItems = await this.mergeSimilarItems(itemsData);
    const items = this.repositoryProcurementRequisitionItem.create(mergeItems);
    await this.repositoryProcurementRequisitionItem.save(items);
    await this.updatePR(items);
  }

  async create(
    itemData: CreateProcurementRequisitionItemDto,
    req?: any,
  ): Promise<ProcurementRequisitionItemResponseDto[]> {
    const query = decodeCollectionQuery(null);
    const response = await super.findAll(
      itemData.procurementRequisitionId,
      query,
      extraCrudOptions,
      req,
    );

    const mergeItems = await this.mergeSimilarItems([
      ...response.items,
      itemData,
    ]);

    const result = await this.repositoryProcurementRequisitionItem.save(
      this.repositoryProcurementRequisitionItem.create(mergeItems),
    );

    await this.updatePR(result);

    return result;
  }

  async updatePR(items: any): Promise<void> {
    const procurementRequisition =
      await this.repositoryProcurementRequisition.findOne({
        where: { id: items[0].procurementRequisitionId },
      });

    const calculatedAmount = items.reduce((total: any, item: any) => {
      return total + item.unitPrice * item.quantity;
    }, procurementRequisition.calculatedAmount);

    procurementRequisition.calculatedAmount = calculatedAmount;

    await this.repositoryProcurementRequisition.update(
      procurementRequisition.id,
      procurementRequisition,
    );
  }

  // async mergeSimilarItems(items: any): Promise<any> {
  //   const mergedItems: any[] = [];
  //   const itemReferences: CreateProcurementRequisitionItemReferenceDto[] = [];
  //   items.forEach((item: any) => {
  //     const itemReference: CreateProcurementRequisitionItemReferenceDto = {
  //       annualProcurementPlanItemId: null,
  //       procurementRequisitionItemId: null,
  //     }
  //     if (item.preBudgetPlanActivityId) {
  //       itemReference.annualProcurementPlanItemId = item.preBudgetPlanActivityId
  //     }
  //     const existingItem = mergedItems.find(
  //       (mergedItem) =>
  //         mergedItem.itemCode === item.itemCode &&
  //         mergedItem.currency === item.currency &&
  //         mergedItem.measurement === item.measurement,
  //     );

  //     if (existingItem) {
  //       existingItem.quantity += item.quantity;
  //       existingItem.unitPrice += item.unitPrice;
  //       itemReference.procurementRequisitionItemId = existingItem.id;
  //     } else {
  //       mergedItems.push({ ...item });
  //       itemReference.procurementRequisitionItemId = item.id;
  //     }
  //     itemReferences.push(itemReference);
  //   });
  //   if (itemReferences && itemReferences.length > 0) {
  //     this.eventEmitter.emit('create.pr_item_References', itemReferences);
  //   }
  //   return mergedItems;
  // }

  async mergeSimilarItems(items: any): Promise<any> {
    const mergedItems: any[] = [];
    const itemReferences: CreateProcurementRequisitionItemReferenceDto[] = [];

    for (const item of items) {
      const itemReference: CreateProcurementRequisitionItemReferenceDto = {
        annualProcurementPlanItemId: null,
        procurementRequisitionItemId: null,
      };

      if (item.preBudgetPlanActivityId) {
        itemReference.annualProcurementPlanItemId =
          item.preBudgetPlanActivityId;
      }

      const existingItem = mergedItems.find(
        (mergedItem) =>
          mergedItem.itemCode === item.itemCode &&
          mergedItem.currency === item.currency &&
          mergedItem.measurement === item.measurement,
      );

      if (existingItem) {
        existingItem.quantity += item.quantity;
        existingItem.unitPrice += item.unitPrice;
        itemReference.procurementRequisitionItemId = existingItem.id;
      } else {
        const newItem = { ...item };
        mergedItems.push(newItem);
        itemReference.procurementRequisitionItemId = newItem.id;
      }

      itemReferences.push(itemReference);
    }

    if (itemReferences && itemReferences.length > 0) {
      this.eventEmitter.emit('create.pr_item_References', itemReferences);
    }

    return mergedItems;
  }
}

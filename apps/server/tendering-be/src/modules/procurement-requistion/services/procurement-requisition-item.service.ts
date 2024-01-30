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
import { ProcurementRequisitionItemResponseDto } from '../dto/procurement-requisition-item.dto';
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
    const batchSize = 50; // max items insert in one query
    const mergeItems = await this.mergeSimilarItems(itemsData);
    for (let i = 0; i < mergeItems.length; i += batchSize) {
      const batch = mergeItems.slice(i, i + batchSize);
      const items = this.repositoryProcurementRequisitionItem.create(batch);
      await this.repositoryProcurementRequisitionItem.save(items);
      await this.updatePR(items, 'add');
    }
  }

  async create(
    itemData: any,
    req?: any,
  ): Promise<ProcurementRequisitionItemResponseDto[]> {
    const query = decodeCollectionQuery(null);
    const response = await super.findAll(
      itemData[0].procurementRequisitionId,
      query,
      extraCrudOptions,
      req,
    );

    const items = [...response.items, ...itemData];
    const flattenedArray = items.flat();
    const mergeItems = await this.mergeSimilarItems(flattenedArray);

    const result = await this.repositoryProcurementRequisitionItem.save(
      this.repositoryProcurementRequisitionItem.create(mergeItems),
    );

    await this.updatePR(result, 'add');

    return result;
  }

  async updatePR(itemData: any, type: 'add' | 'remove'): Promise<void> {
    const procurementRequisitionId =
      itemData.length > 1
        ? itemData[0].procurementRequisitionId
        : itemData.procurementRequisitionId;

    const procurementRequisition =
      await this.repositoryProcurementRequisition.findOneOrFail({
        where: {
          id: procurementRequisitionId,
        },
      });
    if (type === 'add') {
      const calculatedAmount = Array.isArray(itemData)
        ? itemData.reduce(
            (total, item) => total + item.unitPrice * item.quantity,
            0,
          )
        : itemData.unitPrice * itemData.quantity;
      procurementRequisition.calculatedAmount = calculatedAmount;
    } else if (type === 'remove') {
      procurementRequisition.calculatedAmount =
        procurementRequisition.calculatedAmount -
        itemData.unitPrice * itemData.quantity;
    }
    await this.repositoryProcurementRequisition.update(
      procurementRequisition.id,
      procurementRequisition,
    );
  }

  async softDelete(id: string): Promise<void> {
    const item = await super.findOne(id);
    const deleted =
      await this.repositoryProcurementRequisitionItem.softDelete(id);
    if (deleted.affected > 0) {
      await this.updatePR(item, 'remove');
    }
  }

  async mergeSimilarItems(items: any[]): Promise<any> {
    const mergedItems: any[] = [];
    const itemReferences: CreateProcurementRequisitionItemReferenceDto[] = [];

    for (const item of items) {
      item.unitPrice = parseFloat(item.unitPrice);
      item.classification = item.classification
        ? item.classification
        : 'not defined';
      item.uoM = item.uoM ? item.uoM : 'not defined';
      const itemReference: CreateProcurementRequisitionItemReferenceDto = {
        annualProcurementPlanItemId: null,
        procurementRequisitionItemId: null,
      };

      if (item.postBudgetPlanActivityId) {
        itemReference.annualProcurementPlanItemId =
          item.postBudgetPlanActivityId;
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
      if (itemReference.annualProcurementPlanItemId) {
        itemReferences.push(itemReference);
      }
    }

    if (itemReferences && itemReferences.length > 0) {
      this.eventEmitter.emit('create.pr_item_References', itemReferences);
    }

    return mergedItems;
  }
}

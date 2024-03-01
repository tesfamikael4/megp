import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ProcurementRequisitionItem,
  ProcurementRequisition,
} from 'src/entities';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { ExtraCrudService } from 'src/shared/service';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class ProcurementRequisitionItemService extends ExtraCrudService<ProcurementRequisitionItem> {
  constructor(
    @InjectRepository(ProcurementRequisitionItem)
    private readonly repositoryProcurementRequisitionItem: Repository<ProcurementRequisitionItem>,

    @InjectRepository(ProcurementRequisition)
    private readonly repositoryProcurementRequisition: Repository<ProcurementRequisition>,

    @Inject(REQUEST)
    private readonly request: Request,
  ) {
    super(repositoryProcurementRequisitionItem);
  }

  async create(itemData: any, req?: any): Promise<any> {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const result = await entityManager
      .getRepository(ProcurementRequisitionItem)
      .insert(this.repositoryProcurementRequisitionItem.create(itemData));
    await this.updatePR(result, 'add');

    return result;
  }
  async update(itemData: any, req?: any): Promise<ProcurementRequisitionItem> {
    const result = await super.update(itemData, req);
    const balancedItem =
      result.unitPrice * result.quantity -
      itemData.unitPrice * itemData.quantity;
    await this.updatePR(result, 'update', balancedItem);

    return result;
  }

  async softDelete(id: string): Promise<void> {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const item = await super.findOne(id);
    const deleted = await entityManager
      .getRepository(ProcurementRequisitionItem)
      .softDelete(id);

    if (deleted.affected > 0) {
      await this.updatePR(item, 'remove');
    }
  }
  async updatePR(
    itemData: any,
    type: 'add' | 'remove' | 'update',
    balancedItem = null,
  ): Promise<void> {
    const procurementRequisitionId =
      itemData.length > 1
        ? itemData[0].procurementRequisitionId
        : itemData.procurementRequisitionId;
    const procurementRequisition =
      await this.repositoryProcurementRequisition.findOne({
        where: {
          id: procurementRequisitionId,
        },
        relations: ['items'],
      });
    if (type === 'add') {
      procurementRequisition.calculatedAmount =
        procurementRequisition.calculatedAmount +
        itemData.unitPrice * itemData.quantity;
    } else if (type === 'remove') {
      procurementRequisition.calculatedAmount =
        procurementRequisition.calculatedAmount -
        itemData.unitPrice * itemData.quantity;
    } else if (type === 'update') {
      procurementRequisition.calculatedAmount =
        procurementRequisition.calculatedAmount + balancedItem;
    }
    await this.repositoryProcurementRequisition.update(
      procurementRequisition.id,
      procurementRequisition,
    );
  }
}

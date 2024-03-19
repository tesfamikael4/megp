import { HttpException, Inject, Injectable } from '@nestjs/common';
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

  async bulkCreate(itemData: any, user?: any): Promise<any> {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    if (user?.organization) {
      itemData.map((item: any) => {
        item.organizationId = user.organization.id;
      });
    }
    const result = await entityManager
      .getRepository(ProcurementRequisitionItem)
      .save(this.repositoryProcurementRequisitionItem.create(itemData as any));
    await this.updatePR(itemData, 'add');
    return result;
  }

  async create(itemData: any, req?: any): Promise<any> {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const result = await entityManager
      .getRepository(ProcurementRequisitionItem)
      .insert(this.repositoryProcurementRequisitionItem.create(itemData));
    await this.updatePR(itemData, 'add');

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
    let temp = 0;
    if (Array.isArray(itemData)) {
      temp = itemData.reduce(
        (acc, item) => acc + item.unitPrice * item.quantity,
        0,
      );
    } else {
      temp = itemData.unitPrice * itemData.quantity;
    }
    const procurementRequisition =
      await this.repositoryProcurementRequisition.findOne({
        where: {
          id: procurementRequisitionId,
        },
      });
    if (type === 'add') {
      procurementRequisition.calculatedAmount =
        Number(procurementRequisition.calculatedAmount) + temp;
    } else if (type === 'remove') {
      procurementRequisition.calculatedAmount =
        Number(procurementRequisition.calculatedAmount) - temp;
    } else if (type === 'update') {
      procurementRequisition.calculatedAmount = Number(
        procurementRequisition.calculatedAmount + balancedItem,
      );
    }
    if (
      Number(procurementRequisition.totalEstimatedAmount) <
      Number(procurementRequisition.calculatedAmount)
    ) {
      throw new HttpException(
        'Total Estimated Amount cannot be less than Calculated Amount',
        430,
      );
    }
    await this.repositoryProcurementRequisition.update(
      procurementRequisition.id,
      procurementRequisition,
    );
  }
}

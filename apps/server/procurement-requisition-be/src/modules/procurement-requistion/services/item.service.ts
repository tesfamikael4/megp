import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item, ProcurementRequisition } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class ItemService extends ExtraCrudService<Item> {
  constructor(
    @InjectRepository(Item)
    private readonly repositoryItem: Repository<Item>,

    @InjectRepository(ProcurementRequisition)
    private readonly repositoryProcurementRequisition: Repository<ProcurementRequisition>,
  ) {
    super(repositoryItem);
  }

  async create(itemData: any, req?: any): Promise<Item> {
    const result = await super.create(itemData, req);
    await this.updatePR(result, 'add');

    return result;
  }
  async update(itemData: any, req?: any): Promise<Item> {
    const result = await super.update(itemData, req);
    await this.updatePR(result, 'update');

    return result;
  }

  async softDelete(id: string): Promise<void> {
    const item = await super.findOne(id);
    const deleted = await this.repositoryItem.softDelete(id);
    if (deleted.affected > 0) {
      await this.updatePR(item, 'remove');
    }
  }
  async updatePR(
    itemData: any,
    type: 'add' | 'remove' | 'update',
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
        procurementRequisition.calculatedAmount -
        itemData.unitPrice * itemData.quantity;
    }
    await this.repositoryProcurementRequisition.update(
      procurementRequisition.id,
      procurementRequisition,
    );
  }
}

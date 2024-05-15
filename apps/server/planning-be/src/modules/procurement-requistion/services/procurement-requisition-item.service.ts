import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ProcurementRequisitionItem,
  ProcurementRequisition,
} from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

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
    itemData.map((item) => {
      item.organizationId = user.organization.id;
      item.organizationName = user.organization.name;
    });

    const pr = await this.repositoryProcurementRequisition.findOne({
      where: { id: itemData[0].procurementRequisitionId },
    });

    if (!pr) {
      throw new NotFoundException(`Procurement Requisition not found`);
    }

    const bulkCalculated = itemData.reduce(
      (acc, item) => acc + item.unitPrice * item.quantity,
      0,
    );

    const psedoCalculated = Number(pr.calculatedAmount) + bulkCalculated;

    if (Number(pr.totalEstimatedAmount) < Number(psedoCalculated)) {
      await this.recalculateCalculatedAmount(
        itemData[0].procurementRequisitionId,
      );

      throw new HttpException(
        'Total Estimated Amount cannot be less than Calculated Amount',
        430,
      );
    }

    const items = this.repositoryProcurementRequisitionItem.create(itemData);
    await this.repositoryProcurementRequisitionItem.save(items);
    await this.recalculateCalculatedAmount(
      itemData[0].procurementRequisitionId,
    );

    return items;
  }

  async create(itemData: any, req?: any): Promise<any> {
    if (req?.user?.organization) {
      itemData.organizationId = req.user.organization.id;
      itemData.organizationName = req.user.organization.name;
    }

    const pr = await this.repositoryProcurementRequisition.findOne({
      where: { id: itemData.procurementRequisitionId },
    });

    const psedoCalculated =
      Number(pr.calculatedAmount) + itemData.unitPrice * itemData.quantity;

    if (Number(pr.totalEstimatedAmount) < Number(psedoCalculated)) {
      await this.recalculateCalculatedAmount(itemData.procurementRequisitionId);

      throw new HttpException(
        'Total Estimated Amount cannot be less than Calculated Amount',
        430,
      );
    }

    const item = this.repositoryProcurementRequisitionItem.create(itemData);
    await this.repositoryProcurementRequisitionItem.save(item);
    await this.recalculateCalculatedAmount(itemData.procurementRequisitionId);

    return item;
  }

  async update(id: string, itemData: any): Promise<ProcurementRequisitionItem> {
    const item = await this.repositoryProcurementRequisitionItem.findOneOrFail({
      where: { id },
    });

    const pr = await this.repositoryProcurementRequisition.findOneOrFail({
      where: { id: item.procurementRequisitionId },
    });

    const oldAmount = item.unitPrice * item.quantity;
    const newAmount = itemData.unitPrice * itemData.quantity;
    const psedoCalculated = Number(pr.calculatedAmount) - oldAmount + newAmount;

    if (Number(pr.totalEstimatedAmount) < Number(psedoCalculated)) {
      await this.recalculateCalculatedAmount(item.procurementRequisitionId);

      throw new HttpException(
        'Total Estimated Amount cannot be less than Calculated Amount',
        430,
      );
    }

    await this.repositoryProcurementRequisitionItem.update(id, itemData);
    await this.recalculateCalculatedAmount(item.procurementRequisitionId);

    return this.repositoryProcurementRequisitionItem.findOne({ where: { id } });
  }

  async softDelete(id: string): Promise<void> {
    const item = await this.repositoryProcurementRequisitionItem.findOneOrFail({
      where: { id },
    });
    if (!item) {
      throw new NotFoundException(`Item not found`);
    }

    await this.repositoryProcurementRequisitionItem.softDelete(id);
    await this.recalculateCalculatedAmount(item.procurementRequisitionId);
  }

  async recalculateCalculatedAmount(procurementRequisitionId: string) {
    const procurementRequisition =
      await this.repositoryProcurementRequisition.findOne({
        where: {
          id: procurementRequisitionId,
        },
        relations: ['procurementRequisitionItems'],
      });

    if (!procurementRequisition)
      throw new NotFoundException(`ProcurementRequisition not found`);

    const totalCalculatedAmount =
      procurementRequisition.procurementRequisitionItems.reduce(
        (acc, cur) => acc + cur.unitPrice * cur.quantity,
        0,
      );

    await this.repositoryProcurementRequisition.update(
      procurementRequisition.id,
      {
        calculatedAmount: totalCalculatedAmount,
      },
    );
  }
}

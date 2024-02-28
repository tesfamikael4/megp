import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Lot,
  ProcurementMechanism,
  ProcurementTechnicalTeam,
  Tender,
} from 'src/entities';
import { Item } from 'src/entities/tender-item.entity';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { EntityCrudService } from 'src/shared/service';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class TenderService extends EntityCrudService<Tender> {
  constructor(
    @InjectRepository(Tender)
    private readonly tenderRepository: Repository<Tender>,
    @Inject(REQUEST) private request: Request,
  ) {
    super(tenderRepository);
  }

  async create(itemData: any, req?: any): Promise<any> {
    try {
      const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

      const prId = itemData.prId;

      const time = new Date().getTime();

      const tenderPayload = {
        name: `tender_${time}`,
        procurementReferenceNumber: `tender_${time}`,
        budgetAmount: 10,
        budgetAmountCurrency: `tender_${time}`,
        budgetCode: `tender_${time}`,
        prId: prId,
        marketEstimate: 10,
        marketEstimateCurrency: `tender_${time}`,
        status: `tender_${time}`,
        organizationId: req?.user?.organization?.id,
      };
      const tender = manager.getRepository(Tender).create(tenderPayload);
      await manager.getRepository(Tender).insert(tender);

      const procurementTechnicalTeam = new ProcurementTechnicalTeam();
      procurementTechnicalTeam.userId = req?.user?.userId;
      procurementTechnicalTeam.isTeamLead = true;
      procurementTechnicalTeam.tenderId = tender.id;
      await manager
        .getRepository(ProcurementTechnicalTeam)
        .insert(procurementTechnicalTeam);

      const procurementMechanism = new ProcurementMechanism();
      procurementMechanism.PRProcurementMechanisms = { test: 'test' };
      procurementMechanism.invitationType = `procurementMechanism_${time}`;
      procurementMechanism.marketApproach = `marketApproach_${time}`;
      procurementMechanism.stageType = `stageType${time}`;
      procurementMechanism.stage = 1;
      procurementMechanism.tenderId = tender.id;
      await manager
        .getRepository(ProcurementMechanism)
        .insert(procurementMechanism);

      const lot = new Lot();
      lot.number = 1;
      lot.name = `lot_${time}`;
      lot.status = `lot_${time}`;
      lot.tenderId = tender.id;
      const lotResult = await manager.getRepository(Lot).insert(lot);

      const item = new Item();
      item.itemCode = `code_${time}`;
      item.itemType = `type_${time}`;
      item.procurementCategory = `procurementCategory_${time}`;
      item.name = `item_${time}`;
      item.description = `item_${time}`;
      item.quantity = 1;
      item.unitOfMeasure = `item_${time}`;
      item.estimatedPrice = 1;
      item.estimatedPriceCurrency = `item_${time}`;
      item.marketPrice = 1;
      item.marketPriceCurrency = `item_${time}`;
      item.hasBom = false;
      item.lotId = lotResult.identifiers[0].id;
      await manager.getRepository(Item).insert(item);

      return tender;
    } catch (error) {
      throw error;
    }
  }
}

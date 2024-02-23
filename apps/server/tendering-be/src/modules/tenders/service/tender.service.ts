import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Lot,
  ProcurementMechanism,
  ProcurementTechnicalTeam,
  Tender,
} from 'src/entities';
// import { Item } from 'src/entities/item.entity';
import { EntityCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class TenderService extends EntityCrudService<Tender> {
  constructor(
    @InjectRepository(Tender)
    private readonly tenderRepository: Repository<Tender>,
  ) {
    super(tenderRepository);
  }

  async create(itemData: any, req?: any): Promise<any> {
    const prId = itemData.prId;

    const time = new Date().getTime();

    const tender = new Tender();
    tender.name = `tender_${time}`;
    tender.procurementReferenceNumber = `tender_${time}`;
    tender.budgetAmount = 10;
    tender.budgetAmountCurrency = `tender_${time}`;
    tender.budgetCode = `tender_${time}`;
    tender.prId = prId;
    tender.marketEstimate = 10;
    tender.marketEstimateCurrency = `tender_${time}`;
    tender.status = `tender_${time}`;
    tender.organizationId = req?.user?.organization?.id;

    const procurementTechnicalTeam = new ProcurementTechnicalTeam();
    procurementTechnicalTeam.userId = req?.user?.userId;
    procurementTechnicalTeam.isTeamLead = true;

    tender.procurementTechnicalTeams = [procurementTechnicalTeam];

    const procurementMechanism = new ProcurementMechanism();
    procurementMechanism.PRProcurementMechanisms = {};
    procurementMechanism.invitationType = `procurementMechanism_${time}`;
    procurementMechanism.marketApproach = `marketApproach_${time}`;
    procurementMechanism.stageType = `stageType${time}`;
    procurementMechanism.stage = 1;

    tender.procurementMechanism = procurementMechanism;

    const lot = new Lot();
    lot.number = 1;
    lot.name = `lot_${time}`;
    lot.status = `lot_${time}`;

    // const item = new Item();
    // item.itemCode = `code_${time}`;
    // item.itemType = `type_${time}`;
    // item.procurementCategory = `procurementCategory_${time}`;
    // item.name = `item_${time}`;
    // item.description = `item_${time}`;
    // item.quantity = 1;
    // item.unitOfMeasure = `item_${time}`;
    // item.estimatedPrice = 1;
    // item.estimatedPriceCurrency = `item_${time}`;
    // item.marketPrice = 1;
    // item.marketPriceCurrency = `item_${time}`;
    // item.hasBom = false;

    // lot.items = [item];

    tender.lots = [lot];

    await this.tenderRepository.insert(tender);
    return tender;
  }
}

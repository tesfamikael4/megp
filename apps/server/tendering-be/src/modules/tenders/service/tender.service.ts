import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import {
  Lot,
  ProcurementMechanism,
  ProcurementTechnicalTeam,
  SpdTemplate,
  Tender,
} from 'src/entities';
import { Item } from 'src/entities/tender-item.entity';
import { DataResponseFormat } from 'src/shared/api-data';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
} from 'src/shared/collection-query';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { MinIOService } from 'src/shared/min-io/min-io.service';
import { EntityCrudService } from 'src/shared/service';
import {
  EntityManager,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';

@Injectable()
export class TenderService extends EntityCrudService<Tender> {
  constructor(
    @InjectRepository(Tender)
    private readonly tenderRepository: Repository<Tender>,
    private readonly minIOService: MinIOService,
    @Inject(REQUEST) private request: Request,
  ) {
    super(tenderRepository);
  }

  async create(itemData: any, req?: any): Promise<any> {
    try {
      const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

      const prId = itemData.prId;
      const prExists = await this.tenderRepository.existsBy({
        prId,
      });

      if (prExists) {
        throw new Error('PR already used in a tender');
      }

      const PR_ENDPOINT =
        process.env.PR_ENDPOINT ??
        'https://dev-bo.megp.peragosystems.com/planning/api/procurement-requisitions/get-procurement-requisition/';

      const prRequest = await axios.get(PR_ENDPOINT + prId, {
        headers: {
          'X-API-KEY': '25bc1622e5fb42cca3d3e62e90a3a20f',
        },
      });

      const prResponse = prRequest.data;

      const tenderPayload = {
        name: prResponse.name,
        procurementReferenceNumber: prResponse.procurementReference,
        budgetAmount: Number(prResponse.totalEstimatedAmount),
        budgetAmountCurrency: prResponse.currency,
        budgetCode: prResponse.budgetId,
        prId: prId,
        marketEstimate: Number(prResponse.calculatedAmount),
        marketEstimateCurrency: prResponse.currency,
        status: 'DRAFT',
        organizationId: req.user.organization.id,
        organizationName: req.user.organization.name,
      };

      const tender = manager.getRepository(Tender).create(tenderPayload);
      await manager.getRepository(Tender).insert(tender);

      const procurementTechnicalTeams: ProcurementTechnicalTeam[] = [];
      for (const iterator of prResponse.procurementRequisitionTechnicalTeams) {
        const procurementTechnicalTeam = new ProcurementTechnicalTeam();
        procurementTechnicalTeam.tenderId = tender.id;
        procurementTechnicalTeam.userId = iterator.userId;
        procurementTechnicalTeam.userName = iterator.userName;
        procurementTechnicalTeam.isTeamLead = false;
        procurementTechnicalTeams.push(procurementTechnicalTeam);
      }

      await manager
        .getRepository(ProcurementTechnicalTeam)
        .insert(procurementTechnicalTeams);

      const {
        tenantId,
        createdAt,
        updatedAt,
        organizationId,
        id,
        procurementRequisitionId,
        ...PRProcurementMechanisms
      } = prResponse.procurementMechanisms;
      const procurementMechanism = new ProcurementMechanism();
      procurementMechanism.PRProcurementMechanisms = PRProcurementMechanisms;
      procurementMechanism.tenderId = tender.id;
      await manager
        .getRepository(ProcurementMechanism)
        .insert(procurementMechanism);

      const lot = new Lot();
      lot.number = 1;
      lot.name = `lot_1`;
      lot.status = `DRAFT`;
      lot.tenderId = tender.id;
      const lotResult = await manager.getRepository(Lot).insert(lot);

      const items: Item[] = [];
      for (const iterator of prResponse.procurementRequisitionItems) {
        const item = new Item();
        item.itemCode = iterator.itemCode;
        item.procurementCategory = `Goods`;
        item.name = iterator.description;
        item.description = iterator.description;
        item.quantity = iterator.quantity;
        item.unitOfMeasure = iterator.uom;
        item.estimatedPrice = Number(iterator.unitPrice);
        item.estimatedPriceCurrency = iterator.currency;
        item.hasBom = false;
        item.lotId = lotResult.identifiers[0].id;
        items.push(item);
      }
      await manager.getRepository(Item).insert(items);

      // await axios.post('', {

      // })

      return tender;
    } catch (error) {
      throw error;
    }
  }

  async getActiveTenders(query: CollectionQuery) {
    query.includes.push('bdsSubmission');

    query.where.push([
      {
        column: 'status',
        operator: FilterOperators.EqualTo,
        value: 'PUBLISHED',
      },
    ]);
    query.where.push([
      {
        column: 'bdsSubmission.invitationDate',
        operator: FilterOperators.LessThanOrEqualTo,
        value: new Date(),
      },
    ]);
    query.where.push([
      {
        column: 'bdsSubmission.submissionDeadline',
        operator: FilterOperators.GreaterThanOrEqualTo,
        value: new Date(),
      },
    ]);

    const dataQuery = QueryConstructor.constructQuery<Tender>(
      this.tenderRepository,
      query,
    );

    const response = new DataResponseFormat<Tender>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;
    }
    return response;
  }

  async downloadInvitation(id: string) {
    try {
      const tender = await this.tenderRepository.findOne({
        where: {
          id,
        },
        relations: {
          spd: true,
        },
      });

      const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

      const spd = await manager
        .getRepository(SpdTemplate)
        .findOneBy({ id: tender.spd.spdId, type: 'main-document' });
      if (!spd) {
        throw new Error('SPD not found');
      }
      if (!spd.documentPdf) {
        throw new Error('SPD Document not found');
      }

      const presignedDownload =
        await this.minIOService.generatePresignedDownloadUrl(spd.documentPdf);
      return { presignedDownload };
    } catch (error) {
      throw error;
    }
  }
}

import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
  decodeCollectionQuery,
  encodeCollectionQuery,
} from 'src/shared/collection-query';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { MinIOService } from 'src/shared/min-io/min-io.service';
import { EntityCrudService } from 'src/shared/service';
import { EntityManager, Repository } from 'typeorm';
import {
  ChangeTenderStatusDto,
  CreateTenderDto,
  GenerateTenderDocumentDto,
  ReAdvertiseTenderDto,
} from '../dto';
import { DocumentManipulatorService } from 'src/shared/document-manipulator/document-manipulator.service';
import { BucketNameEnum } from 'src/shared/min-io/bucket-name.enum';
import { TenderMilestone } from 'src/entities/tender-milestone.entity';
import { TenderMilestoneEnum } from 'src/shared/enums/tender-milestone.enum';
import {
  ItemStatusEnum,
  LotStatusEnum,
  TenderStatusEnum,
} from 'src/shared/enums/tender-status.enum';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class TenderService extends EntityCrudService<Tender> {
  constructor(
    @InjectRepository(Tender)
    private readonly tenderRepository: Repository<Tender>,
    private readonly minIOService: MinIOService,
    private readonly documentManipulatorService: DocumentManipulatorService,
    private readonly amqpConnection: AmqpConnection,
    @Inject(REQUEST) private request: Request,
  ) {
    super(tenderRepository);
  }

  async create(itemData: CreateTenderDto, req?: any): Promise<any> {
    try {
      const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

      const prId = itemData.prId;
      const prExists = await this.tenderRepository.existsBy({
        prId,
      });

      if (prExists) {
        throw new Error('PR already used in a tender');
      }

      const PR_BASE_ENDPOINT =
        process.env.PR_BASE_ENDPOINT ??
        'https://dev-bo.megp.peragosystems.com/planning/api/';

      const prRequest = await axios.get(
        `${PR_BASE_ENDPOINT}procurement-requisitions/get-procurement-requisition/${prId}`,
        {
          headers: {
            'X-API-KEY':
              process.env.API_KEY ?? '25bc1622e5fb42cca3d3e62e90a3a20f',
          },
        },
      );

      const prResponse = prRequest.data;

      if (prResponse.status !== 'APPROVED') {
        throw new BadRequestException('pr_is_not_approved');
      } else if (
        !prResponse.procurementRequisitionTechnicalTeams ||
        prResponse.procurementRequisitionTechnicalTeams.length < 1
      ) {
        throw new BadRequestException('pr_has_no_technical_team');
      } else if (!prResponse.procurementMechanisms) {
        throw new BadRequestException('pr_has_no_mechanism');
      }

      const tenderPayload = {
        name: prResponse.name,
        procurementCategory: prResponse.procurementCategory ?? 'Goods',
        procurementReferenceNumber: prResponse.procurementReference,
        budgetAmount: Number(prResponse.totalEstimatedAmount),
        budgetAmountCurrency: prResponse.currency,
        budgetCode: prResponse.budget?.budgetCode,
        prId: prId,
        marketEstimate: Number(prResponse.calculatedAmount),
        marketEstimateCurrency: prResponse.currency,
        status: TenderStatusEnum.DRAFT,
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
        procurementTechnicalTeam.userName = iterator.name;
        procurementTechnicalTeam.isTeamLead = iterator.isTeamLead ?? false;
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

      const lot = manager.getRepository(Lot).create({
        number: 1,
        name: `Lot 1`,
        status: LotStatusEnum.ACTIVE,
        tenderId: tender.id,
      });
      await manager.getRepository(Lot).insert(lot);

      const items: Item[] = [];
      for (const iterator of prResponse.procurementRequisitionItems) {
        const item = new Item();
        item.itemCode = iterator.itemCode;
        item.procurementCategory = iterator.procurementCategory ?? `Goods`;
        item.name = iterator.description;
        item.description = iterator.description;
        item.quantity = iterator.quantity;
        item.unitOfMeasure = iterator.uom;
        item.estimatedPrice = Number(iterator.unitPrice);
        item.estimatedPriceCurrency = iterator.currency;
        item.hasBom = false;
        item.lotId = lot.id;
        items.push(item);
      }
      await manager.getRepository(Item).insert(items);
      await manager.getRepository(TenderMilestone).insert({
        tenderId: tender.id,
        lotId: lot.id,
        isCurrent: true,
        milestoneNum: TenderMilestoneEnum.Initiation,
        milestoneTxt: 'Initiation',
      });

      await axios.post(
        `${PR_BASE_ENDPOINT}procurement-requisitions/update-procurement-requisition-is-used/${prId}`,
        {},
        {
          headers: {
            'X-API-KEY':
              process.env.API_KEY ?? '25bc1622e5fb42cca3d3e62e90a3a20f',
          },
        },
      );

      return tender;
    } catch (error) {
      throw error;
    }
  }

  async findAll(query: CollectionQuery, req?: any) {
    query.includes.push('procurementTechnicalTeams');

    query.where.push([
      {
        column: 'procurementTechnicalTeams.userId',
        operator: FilterOperators.EqualTo,
        value: req.user.userId,
      },
    ]);

    query.where.push([
      {
        column: 'status',
        operator: FilterOperators.NotEqualTo,
        value: TenderStatusEnum.CANCELED,
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

  async findOne(id: any, req?: any) {
    return await this.tenderRepository.findOne({
      where: { id },
      relations: {
        bdsEvaluation: true,
        bdsSubmission: true,
        bdsPreparation: true,
      },
    });
  }

  async getActiveTenders(query: CollectionQuery) {
    query.includes.push('bdsSubmission');

    query.where.push([
      {
        column: 'status',
        operator: FilterOperators.EqualTo,
        value: TenderStatusEnum.PUBLISHED,
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

  async getClosedTenders(query: CollectionQuery, req: any) {
    query.includes.push('bdsSubmission');

    query.where.push([
      {
        column: 'organizationId',
        operator: FilterOperators.EqualTo,
        value: req.user.organization.id,
      },
    ]);
    query.where.push([
      {
        column: 'status',
        operator: FilterOperators.EqualTo,
        value: TenderStatusEnum.PUBLISHED,
      },
    ]);
    query.where.push([
      {
        column: 'bdsSubmission.submissionDeadline',
        operator: FilterOperators.LessThanOrEqualTo,
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

  async getReAdvertiseTenders(query: CollectionQuery, req: any) {
    query.includes.push('procurementTechnicalTeams');
    query.includes.push('lots');
    query.includes.push('lots.items');

    query.where.push([
      {
        column: 'procurementTechnicalTeams.userId',
        operator: FilterOperators.EqualTo,
        value: req.user.userId,
      },
    ]);

    const dataQuery = QueryConstructor.constructQuery<Tender>(
      this.tenderRepository,
      query,
    ).andWhere(
      'tenders.status =:tenderStatus OR lots.status =:lotStatus OR items.status =:itemStatus',
      {
        tenderStatus: TenderStatusEnum.CANCELED,
        lotStatus: LotStatusEnum.CANCELED,
        itemStatus: ItemStatusEnum.CANCELED,
      },
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

  async changeStatus(input: ChangeTenderStatusDto) {
    const tender = await this.tenderRepository.findOneBy({
      id: input.id,
    });

    if (!tender) {
      throw new BadRequestException('Tender not found');
    } else if (
      tender.status == TenderStatusEnum.DRAFT &&
      input.status == TenderStatusEnum.SUBMITTED
    ) {
      await this.validateTender(tender.id);
    } else if (
      tender.status == TenderStatusEnum.SUBMITTED &&
      input.status == TenderStatusEnum.PUBLISHED
    ) {
      await this.generateTenderInvitation({ id: tender.id });
    }

    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    await manager
      .getRepository(Tender)
      .update({ id: input.id }, { status: input.status });

    if (
      tender.status == TenderStatusEnum.REVIEWED &&
      input.status == TenderStatusEnum.APPROVAL
    ) {
      this.amqpConnection.publish(
        'workflow-broadcast-exchanges',
        'workflow.initiate',
        {
          id: tender.id,
          name: 'tenderApproval',
          itemName: tender.name,
          organizationId: tender.organizationId,
        },
      );
    }
  }

  async tenderApproval(data: any) {
    const tender = await this.tenderRepository.findOneBy({
      id: data.itemId,
    });

    if (!tender) {
      throw new BadRequestException('Tender not found');
    }
    if (data.status == 'Approved') {
      await this.generateTenderInvitation({ id: tender.id });
    }
    await this.tenderRepository.update(
      { id: data.itemId },
      {
        status:
          data.status == 'Approved'
            ? TenderStatusEnum.APPROVED
            : TenderStatusEnum.ADJUSTED,
      },
    );
  }

  async generateTenderDocument(input: GenerateTenderDocumentDto) {
    const tender = await this.tenderRepository.findOne({
      where: {
        id: input.id,
      },
      relations: {
        spd: true,
        bdsGeneral: true,
        bdsPreparation: true,
        bdsSubmission: true,
      },
    });

    if (!tender) {
      throw new BadRequestException('tender_not_found');
    }

    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const spdTemplate = await manager.getRepository(SpdTemplate).findOneBy({
      spdId: tender.spd.spdId,
      type: 'main-document',
    });
    if (!spdTemplate) {
      throw new BadRequestException('spd_document_not_found');
    }

    let bds = tender.spd.bds;
    let scc = tender.spd.scc;

    if (!bds) {
      bds = await this.getDownloadUrl(tender.spd.spdId, 'bds');
    }
    if (!scc) {
      scc = await this.getDownloadUrl(tender.spd.spdId, 'scc');
    }

    const bdsHtml = await this.downloadAndConvert(bds, {
      public_body: tender.organizationName,
      clarification_deadline_date: new Date(
        tender.bdsGeneral.clarificationDeadline,
      ).toDateString(),
      clarification_deadline_time: new Date(
        tender.bdsGeneral.clarificationDeadline,
      ).toLocaleTimeString(),
      incoterm_edition: tender.bdsPreparation.incotermsEdition,
      opening_date_date: new Date(
        tender.bdsSubmission.openingDate,
      ).toDateString(),
      opening_date_time: new Date(
        tender.bdsSubmission.openingDate,
      ).toLocaleTimeString(),
      date: new Date(tender.bdsSubmission.openingDate).toDateString(),
      time: new Date(tender.bdsSubmission.openingDate).toLocaleTimeString(),
    });

    const sccHtml = await this.downloadAndConvert(scc, {
      public_body: tender.organizationName,
      procurement_reference_no: tender.procurementReferenceNumber,
    });

    const fileReadable = await this.minIOService.downloadBuffer(
      spdTemplate.documentDocx,
    );
    const fileBuffer =
      await this.documentManipulatorService.streamToBuffer(fileReadable);

    const mainDocumentBuffer =
      await this.documentManipulatorService.populateTemplate(fileBuffer, {
        public_body: tender.organizationName,
        procurement_reference_no: tender.procurementReferenceNumber,
        project_name: tender.name,
        date_of_issue_of_bidding: new Date().toDateString(),
        subject_of_procurement: tender.name,
        bds: bdsHtml,
        scc: sccHtml,
        tor: '<p>Test Tor</p>',
      });

    const pdfBuffer =
      await this.documentManipulatorService.convertDocxToPdf(
        mainDocumentBuffer,
      );
    const tenderDocument = await this.minIOService.uploadBuffer(
      pdfBuffer,
      tender.name + '-bidding-document.pdf',
      'application/pdf',
      BucketNameEnum.TENDERING_DOCUMENT,
    );

    await this.tenderRepository.update(tender.id, {
      tenderDocument: tenderDocument as any,
    });

    return {
      ...tender,
      tenderDocument,
    };
  }

  async downloadTenderDocument(id: string) {
    try {
      const tender = await this.tenderRepository.findOne({
        where: {
          id,
        },
      });
      if (!tender.tenderDocument) {
        throw new Error('tender_document_not_found');
      }

      const presignedDownload =
        await this.minIOService.generatePresignedDownloadUrl(
          tender.tenderDocument,
        );
      return { presignedDownload };
    } catch (error) {
      throw error;
    }
  }

  async generateTenderInvitation(input: GenerateTenderDocumentDto) {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const tender = await manager.getRepository(Tender).findOne({
      where: {
        id: input.id,
      },
      relations: {
        spd: true,
      },
    });

    const spdTemplate = await manager.getRepository(SpdTemplate).findOneBy({
      spdId: tender.spd.spdId,
      type: 'invitation',
    });
    if (!spdTemplate) {
      throw new BadRequestException('spd_document_not_found');
    }

    const fileReadable = await this.minIOService.downloadBuffer(
      spdTemplate.documentDocx,
    );

    const fileBuffer =
      await this.documentManipulatorService.streamToBuffer(fileReadable);

    const invitationDocumentBuffer =
      await this.documentManipulatorService.populateTemplate(fileBuffer, {
        public_body: tender.organizationName,
        procurement_reference_no: tender.procurementReferenceNumber,
        subject_of_procurement: tender.name,
      });

    const pdfBuffer = await this.documentManipulatorService.convertDocxToPdf(
      invitationDocumentBuffer,
    );

    const tenderInvitation = await this.minIOService.uploadBuffer(
      pdfBuffer,
      tender.name + '-invitation-document.pdf',
      'application/pdf',
      BucketNameEnum.TENDERING_DOCUMENT,
    );

    await manager.getRepository(Tender).update(tender.id, {
      tenderInvitation: tenderInvitation as any,
    });

    return {
      ...tender,
      tenderInvitation,
    };
  }

  async downloadTenderInvitation(id: string) {
    try {
      const tender = await this.tenderRepository.findOne({
        where: {
          id,
        },
      });
      if (!tender.tenderInvitation) {
        throw new Error('tender_document_not_found');
      }

      const presignedDownload =
        await this.minIOService.generatePresignedDownloadUrl(
          tender.tenderInvitation,
        );
      return { presignedDownload };
    } catch (error) {
      throw error;
    }
  }

  async softDelete(id: string, req?: any): Promise<void> {
    const item = await this.findOneOrFail(id);
    await this.tenderRepository.update(item.id, {
      status: TenderStatusEnum.CANCELED,
    });
  }

  async reAdvertiseTender(payload: ReAdvertiseTenderDto) {
    const tender = await this.tenderRepository.findOne({
      where: {
        id: payload.id,
      },
      relations: {
        procurementMechanism: true,
        procurementTechnicalTeams: true,
        lots: {
          items: true,
        },
      },
    });
  }

  private async downloadAndConvert(fileInfo: any, data: any) {
    const fileReadable = await this.minIOService.downloadBuffer(fileInfo);
    const fileBuffer =
      await this.documentManipulatorService.streamToBuffer(fileReadable);

    const populatedFileBuffer =
      await this.documentManipulatorService.populateTemplate(fileBuffer, data);

    const html = await this.documentManipulatorService.convertDocxToHTMLString(
      populatedFileBuffer,
      '.html',
    );
    return html;
  }

  private async validateTender(id: string) {
    const tenderRelations = [
      'spd',
      'lots',
      'tenderPersonals',
      'bdsGeneral',
      'bdsPreparation',
      'bdsSubmission',
      'bdsEvaluation',
      'bdsAward',
      'sccGeneralProvisions',
      'sccContractDeliverables',
      'sccPaymentTerms',
      'sccPaymentSchedules',
      'sccGuarantees',
      'sccLiabilities',
      'tenderClassifications',
      'tenderParticipationFee',
    ];

    const tender = await this.tenderRepository.findOne({
      where: { id },
      relations: [
        'lots.items',
        'lots.eqcPreliminaryExaminations',
        'lots.eqcQualifications',
        'lots.eqcDocumentaryEvidences',
        'lots.eqcTechnicalScorings',
        ...tenderRelations,
      ],
    });

    const isEmpty = (value: any) => {
      return (
        value == null ||
        (typeof value === 'object' && Object.keys(value).length === 0) ||
        (typeof value === 'string' && value.trim().length === 0)
      );
    };

    tenderRelations.forEach((relation) => {
      if (isEmpty(tender[relation])) {
        throw new BadRequestException(`${relation} not found`);
      }
    });

    const lotRelations = [
      'items',
      'eqcPreliminaryExaminations',
      'eqcQualifications',
      'eqcDocumentaryEvidences',
      'eqcTechnicalScorings',
    ];

    tender.lots.forEach((lot) => {
      lotRelations.forEach((relation) => {
        if (isEmpty(lot[relation])) {
          throw new BadRequestException(`${lot.name} ${relation} not found`);
        }
      });
    });
  }

  private async getDownloadUrl(spdId: string, type: string) {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const spdTemplate = await manager.getRepository(SpdTemplate).findOneBy({
      spdId,
      type,
    });
    if (!spdTemplate) {
      throw new NotFoundException(`spd_not_found`);
    } else if (!spdTemplate.documentDocx) {
      throw new NotFoundException(`spd_document_not_found`);
    }

    return spdTemplate.documentDocx;
  }
}

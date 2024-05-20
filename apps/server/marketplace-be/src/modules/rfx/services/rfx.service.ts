import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ENTITY_MANAGER_KEY,
  EntityCrudService,
  MinIOService,
} from 'megp-shared-be';
import {
  RFX,
  RFXItem,
  RfxProcurementTechnicalTeam,
  RfxRevisionApproval,
} from 'src/entities';
import { RfxProcurementMechanism } from 'src/entities/rfx-procurement-mechanism.entity';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { CreateRFXDto, UpdateRFXDto } from '../dtos/rfx.dto';
import { RfxBidInvitation } from '../../../entities';
import { ClientProxy } from '@nestjs/microservices';
import { PdfGeneratorService } from 'src/utils/services/pdf-generator.service';
import { DocumentService } from 'src/utils/services/document.service';
import { SolRoundService } from 'src/modules/solicitation/services/round.service';
import {
  ERfxStatus,
  ERfxRevisionApprovalStatusEnum,
  ERfxItemStatus,
} from 'src/utils/enums';

@Injectable()
export class RfxService extends EntityCrudService<RFX> {
  constructor(
    @InjectRepository(RFX)
    private readonly rfxRepository: Repository<RFX>,
    @InjectRepository(RFXItem)
    private readonly rfxItemRepository: Repository<RFXItem>,
    @Inject(REQUEST) private request: Request,
    @Inject('RFX_RMQ_SERVICE')
    private readonly rfxRmqClient: ClientProxy,
    private dataSource: DataSource,
    private readonly pdfGeneratorService: PdfGeneratorService,
    private readonly documentService: DocumentService,
    private readonly minIOService: MinIOService,
    private readonly solRoundServuce: SolRoundService,
  ) {
    super(rfxRepository);
  }

  async create(itemData: CreateRFXDto, req?: any): Promise<any> {
    try {
      const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

      const prId = itemData.prId;
      const prExists = await this.rfxRepository.existsBy({
        prId,
      });

      if (prExists) {
        throw new Error('PR already used in an RFX');
      }

      const PR_ENDPOINT =
        process.env.PR_ENDPOINT ??
        'https://dev-bo.megp.peragosystems.com/planning/api/procurement-requisitions/get-procurement-requisition/';

      const prRequest = await axios.get(PR_ENDPOINT + prId, {
        headers: {
          'X-API-KEY':
            process.env.API_KEY || '25bc1622e5fb42cca3d3e62e90a3a20f',
        },
      });

      const prResponse = prRequest.data;

      if (!prResponse) throw new BadRequestException('pr not found');

      // if (prResponse.procurementApplication != 'marketplace')
      //   throw new BadRequestException('wrong pr procurement application');

      if (prResponse.status != 'APPROVED')
        throw new BadRequestException('pr is not approved');

      const rfxPayload = {
        name: prResponse?.name,
        procurementCategory: prResponse?.procurementMechanisms?.procurementType,
        procurementReferenceNumber: prResponse?.procurementReference,
        budgetAmount: Number(prResponse?.totalEstimatedAmount),
        budgetAmountCurrency: prResponse?.currency,
        budgetCode: prResponse?.budget?.budgetCode || 'N/A',
        prId: prId,
        marketEstimate: Number(prResponse?.calculatedAmount),
        marketEstimateCurrency: prResponse?.currency,
        status: ERfxStatus.DRAFT,
        organizationId:
          req?.user?.organization.id || prResponse?.organizationId,
        organizationName:
          req?.user?.organization.name || prResponse?.organizationName,
      };

      const rfx = manager.getRepository(RFX).create(rfxPayload);
      await manager.getRepository(RFX).insert(rfx);

      const procurementTechnicalTeams: RfxProcurementTechnicalTeam[] = [];
      for (const iterator of prResponse.procurementRequisitionTechnicalTeams) {
        const procurementTechnicalTeam = new RfxProcurementTechnicalTeam();
        procurementTechnicalTeam.rfxId = rfx.id;
        procurementTechnicalTeam.userId = iterator?.userId;
        procurementTechnicalTeam.userName = iterator?.userName;
        procurementTechnicalTeam.isTeamLead = false;
        procurementTechnicalTeams.push(procurementTechnicalTeam);
      }

      await manager
        .getRepository(RfxProcurementTechnicalTeam)
        .insert(procurementTechnicalTeams);

      const {
        tenantId,
        createdAt,
        updatedAt,
        deletedAt,
        organizationId,
        id,
        procurementRequisitionId,
        ...PRRfxProcurementMechanisms
      } = prResponse.procurementMechanisms;

      const procurementMechanism = new RfxProcurementMechanism();
      procurementMechanism.PRRfxProcurementMechanisms =
        PRRfxProcurementMechanisms;
      procurementMechanism.rfxId = rfx.id;
      await manager
        .getRepository(RfxProcurementMechanism)
        .insert(procurementMechanism);

      const items: RFXItem[] = [];

      if (prResponse.procurementRequisitionItems.length == 0)
        throw new BadRequestException('PR does not have Items');

      for (const iterator of prResponse.procurementRequisitionItems) {
        const item = new RFXItem();
        item.rfxId = rfx.id;
        item.itemCode = iterator?.itemCode;
        item.procurementCategory =
          prResponse.procurementMechanisms.procurementType;
        item.name = iterator?.description;
        item.description = iterator?.description;
        item.quantity = iterator?.quantity;
        item.unitOfMeasure = iterator?.uom;
        item.estimatedPrice = Number(iterator?.unitPrice);
        item.estimatedPriceCurrency = iterator?.currency;
        item.prId = itemData.prId;
        items.push(item);
      }
      await manager.getRepository(RFXItem).insert(items);

      // await axios.post('', {

      // })

      return rfx;
    } catch (error) {
      throw error;
    }
  }

  async adjust(rfxId: string) {
    const rfx = await this.rfxRepository.findOne({
      where: {
        id: rfxId,
        status: ERfxStatus.TEAM_REVIEWAL,
      },
      select: {
        id: true,
        status: true,
      },
      relations: {
        revisionApprovals: true,
      },
    });

    if (!rfx) throw new BadRequestException('rfx on reviewal not found');

    const isAdjustable = await this.isAdjustable(rfx);
    if (!isAdjustable) throw new BadRequestException('rfx not adjustable');

    await this.rfxRepository.update(rfxId, { status: ERfxStatus.ADJUSTEDMENT });

    return rfx;
  }

  async submitRfx(rfxId: string): Promise<any> {
    const rfx = await this.getCompleteRfx(rfxId);

    if (rfx.status != ERfxStatus.TEAM_REVIEWAL)
      throw new BadRequestException('rfx not on reviewal');

    await this.validateRfxOnSubmit(rfx);

    this.initiateWorkflow(rfx);

    rfx.status = ERfxStatus.SUBMITTED;

    await this.updateRfxChildrenStatus(rfxId, 'SUBMITTED');

    return rfx;
  }

  async handleWorkflowResponse(payload: any) {
    const rfx = await this.rfxRepository.findOne({
      where: {
        id: payload.itemId,
        status: ERfxStatus.SUBMITTED,
      },
      relations: {
        rfxBidProcedure: true,
      },
    });

    if (!rfx) throw new BadRequestException('RFX not found');

    const status = payload.status == 'Approved' ? 'APPROVED' : 'REJECTED';

    await this.updateRfxChildrenStatus(rfx.id, status);
    if (status == 'APPROVED')
      await this.solRoundServuce.scheduleRounds(rfx.rfxBidProcedure);
  }

  async submitForReview(rfxId: string, payload: UpdateRFXDto) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const rfx = await this.getCompleteRfx(rfxId);

    // if (rfx.status != ERfxStatus.DRAFT && rfx.status != ERfxStatus.ADJUSTEDMENT)
    //   throw new BadRequestException('rfx_not_draft_or_adjustment');

    await this.validateRfxOnSubmit(rfx);

    const doc = await this.generateReviewDocument(rfx);

    await Promise.all([
      entityManager.getRepository(RFX).update(rfxId, {
        status: ERfxStatus.TEAM_REVIEWAL,
        reviewDeadline: payload.reviewDeadline,
      }),
      entityManager.getRepository(RfxRevisionApproval).delete({
        rfxId,
      }),
    ]);

    return doc;
  }

  async isUpdatable(rfx: RFX): Promise<boolean> {
    if (rfx.status == ERfxStatus.DRAFT) return true;

    if (
      rfx.status == ERfxStatus.TEAM_REVIEWAL &&
      rfx.revisionApprovals?.length == 0
    )
      return true;

    const now = new Date(Date.now());

    if (
      rfx.status == ERfxStatus.TEAM_REVIEWAL &&
      now > new Date(rfx.reviewDeadline)
    )
      return true;

    if (rfx.status == ERfxStatus.ADJUSTEDMENT) return true;

    return false;
  }

  async isAdjustable(rfx: RFX): Promise<boolean> {
    if (
      rfx.revisionApprovals.some(
        (approval) => approval.status == ERfxRevisionApprovalStatusEnum.ADJUST,
      )
    )
      return true;

    const now = new Date(Date.now());
    const reviewDeadline = new Date(rfx.reviewDeadline);

    if (now > reviewDeadline) return true;

    if (rfx.revisionApprovals.length == 2) return true;

    return false;
  }
  async getNotes(rfxId: string, verison: number) {
    try {
      const GET_NOTES_ENDPOINT =
        process.env.GET_NOTES_ENDPOINT ??
        'https://dev-bo.megp.peragosystems.com/infrastructure/api/notes/';

      const noteRequest = await axios.get(
        `${GET_NOTES_ENDPOINT}${rfxId}/${verison}`,
        {
          headers: {
            'x-api-key':
              process.env.API_KEY || '25bc1622e5fb42cca3d3e62e90a3a20f',
          },
        },
      );

      return noteRequest.data;
    } catch (error) {
      throw error;
    }
  }

  async generateReviewDocument(rfx: RFX) {
    const organization = {
      organizationName: rfx.organizationName,
      organizationId: rfx.organizationId,
    };

    const buffer = await this.pdfGeneratorService.pdfGenerator(rfx, 'rfx');

    const fileInfo = await this.minIOService.uploadBuffer(
      buffer,
      'rfxReview.pdf',
      'application/pdf',
      'megp',
    );

    // transaction
    const doc = await this.documentService.create(
      {
        fileInfo,
        title: rfx.name,
        itemId: rfx.id,
        version: 1,
        type: 'rfx',
        key: 'onReviewRequest',
      },
      organization,
    );

    return doc;
  }

  private async getCompleteRfx(rfxId: string) {
    const rfx = await this.rfxRepository.findOne({
      where: {
        id: rfxId,
      },
      relations: {
        items: {
          rfxItemDocuments: true,
          bidInvitations: true,
          technicalRequirement: true,
        },
        notes: true,
        revisionApprovals: true,
        rfxBidContractCondition: true,
        rfxBidProcedure: true,
        rfxBidQualifications: true,
        rfxDocumentaryEvidences: true,
        rfxProcurementMechanism: true,
        rfxProcurementTechnicalTeams: true,
      },
    });

    if (!rfx) {
      throw new BadRequestException('no rfx found');
    }

    return rfx;
  }

  private async updateRfxChildrenStatus(rfxId: string, status: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      queryRunner.manager.connection.transaction(async (entityManager) => {
        const [, , rfxItems] = await Promise.all([
          entityManager.getRepository(RFX).update(rfxId, {
            status,
          }),
          entityManager.getRepository(RFXItem).update(
            { rfxId },
            {
              status,
            },
          ),
          entityManager.getRepository(RFXItem).find({
            where: {
              rfxId: rfxId,
            },
            select: {
              id: true,
            },
          }),
        ]);

        const rfxItemIds = rfxItems.map((item) => item.id);

        await entityManager.getRepository(RfxBidInvitation).update(
          {
            rfxItemId: In(rfxItemIds),
          },
          {
            status,
          },
        );
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async validateRfxOnSubmit(rfx: RFX) {
    if (!rfx.rfxBidQualifications) {
      throw new BadRequestException('rfx bid qualification not found');
    }
    if (!rfx.rfxProcurementTechnicalTeams) {
      throw new BadRequestException('rfx procurement technical team not found');
    }
    if (!rfx.rfxBidContractCondition) {
      throw new BadRequestException('rfx bid contract condition not found');
    }
    if (!rfx.rfxBidProcedure) {
      throw new BadRequestException('rfx bid procedure not found');
    }
    if (!rfx.rfxProcurementMechanism) {
      throw new BadRequestException('rfx procurement mechanism not found');
    }

    await this.validateRfxReviewal(rfx);
    this.validateInvitation(rfx);

    return true;
  }

  private async validateRfxReviewal(rfx: RFX) {
    const now = new Date(Date.now());
    const revisions = rfx.revisionApprovals;

    if (now < new Date(rfx.reviewDeadline)) {
      if (revisions.length != 2)
        throw new BadRequestException('reviewal not ended');
    }

    const allApproved = revisions.every(
      (revision) => revision.status === ERfxRevisionApprovalStatusEnum.APPROVED,
    );

    if (!allApproved)
      throw new BadRequestException('all revisions must be approved');
  }

  private validateInvitation(rfx: RFX) {
    const allItemsHaveInvitations = rfx.items.every(
      (item) => item.status == ERfxItemStatus.INVITATION_PREPARED,
    );

    if (!allItemsHaveInvitations)
      throw new BadRequestException('Item invitation has not ended');
  }

  private initiateWorkflow(rfx: RFX) {
    const rfxPayload = {
      itemName: rfx.name,
      id: rfx.id,
      organizationId: rfx.organizationId,
      name: 'marketPlace',
    };

    this.rfxRmqClient.emit('initiate-workflow', rfxPayload);
  }
}

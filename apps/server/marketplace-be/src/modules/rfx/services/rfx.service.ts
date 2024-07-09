import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import axios from 'axios';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CollectionQuery,
  DataResponseFormat,
  ENTITY_MANAGER_KEY,
  EntityCrudService,
  MinIOService,
  QueryConstructor,
} from 'megp-shared-be';
import {
  RFX,
  RFXItem,
  RfxBidProcedure,
  RfxProcurementTechnicalTeam,
  RfxRevisionApproval,
} from 'src/entities';
import { RfxProcurementMechanism } from 'src/entities/rfx-procurement-mechanism.entity';
import {
  DataSource,
  DeepPartial,
  EntityManager,
  In,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { CreateRFXDto, UpdateRFXDto } from '../dtos/rfx.dto';
import { RfxProductInvitation } from '../../../entities';
import { PdfGeneratorService } from 'src/utils/services/pdf-generator.service';
import { DocumentService } from 'src/utils/services/document.service';
import { SolRoundService } from 'src/modules/solicitation/services/round.service';
import {
  ERfxStatus,
  ERfxRevisionApprovalStatusEnum,
  ERfxItemStatus,
  ERfxOpenProductsStatus,
  EInvitationStatus,
  ERfxProcuredBy,
} from 'src/utils/enums';
import { WorkflowHandlerService } from './workflow-handler.service';
import { ClientProxy } from '@nestjs/microservices';
import currentTime from 'src/utils/services/time-provider';
import { EMarketplaceBucketName } from 'src/utils/enums/bucket.enum';
import { WorkflowItemService } from 'src/utils/services/workflow-item.service';
import { WorkflowItemDetailService } from 'src/utils/services/workflow-item-detail.service';

@Injectable()
export class RfxService extends EntityCrudService<RFX> {
  constructor(
    @InjectRepository(RFX)
    private readonly rfxRepository: Repository<RFX>,
    @InjectRepository(RFXItem)
    private readonly rfxItemRepository: Repository<RFXItem>,
    @InjectRepository(RfxBidProcedure)
    private readonly rfxBidProcedureRepository: Repository<RfxBidProcedure>,
    @Inject(REQUEST) private request: Request,
    private dataSource: DataSource,
    @Inject('WORKFLOW_RMQ_SERVICE')
    private readonly workflowRMQClient: ClientProxy,
    private readonly pdfGeneratorService: PdfGeneratorService,
    private readonly documentService: DocumentService,
    private readonly minIOService: MinIOService,
    private readonly solRoundService: SolRoundService,
    private readonly workflowHandlerService: WorkflowHandlerService,
    private readonly workflowItemService: WorkflowItemService,
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
        throw new Error('PR already used in an RFQ');
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

      if (!prResponse) throw new BadRequestException('pr not found');

      if (
        prResponse.procurementApplication != ERfxProcuredBy.AUCTIONING &&
        prResponse.procurementApplication != ERfxProcuredBy.PURCHASING
      )
        throw new BadRequestException('wrong pr procurement application');

      const rfxPayload: DeepPartial<RFX> = {
        name: prResponse?.name,
        description: prResponse?.description,
        procurementCategory: prResponse?.procurementMechanisms?.procurementType,
        procurementReferenceNumber: prResponse?.procurementReference,
        calculatedAmount: Number(prResponse?.calculatedAmount),
        budgetAmount: Number(prResponse?.totalEstimatedAmount),
        budgetAmountCurrency: prResponse?.currency,
        budgetCode: prResponse?.budget?.budgetCode,
        procuredBy: prResponse?.procurementApplication,
        prId: prId,
        status: ERfxStatus.DRAFT,
        organizationId:
          req?.user?.organization.id || prResponse?.organizationId,
        organizationName:
          req?.user?.organization.name || prResponse?.organizationName,
      };

      const rfx = manager.getRepository(RFX).create(rfxPayload);
      await manager.getRepository(RFX).insert(rfx);

      const procurementTechnicalTeams: RfxProcurementTechnicalTeam[] = [];

      if (
        !prResponse.procurementRequisitionTechnicalTeams.find(
          (team) => team.isTeamLeader,
        )
      )
        throw new NotFoundException('PR Technical Team Leader is not found');

      for (const iterator of prResponse.procurementRequisitionTechnicalTeams) {
        const procurementTechnicalTeam = new RfxProcurementTechnicalTeam();
        procurementTechnicalTeam.rfxId = rfx.id;
        procurementTechnicalTeam.userId = iterator?.userId;
        procurementTechnicalTeam.userName = iterator?.userName;
        procurementTechnicalTeam.isTeamLead = iterator?.isTeamLeader;
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
        items.push(item);
      }
      await manager.getRepository(RFXItem).insert(items);

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
        rfxBidProcedure: {
          id: true,
          reviewDeadline: true,
        },
      },
      relations: {
        revisionApprovals: true,
        rfxBidProcedure: true,
      },
    });

    if (!rfx) throw new BadRequestException('RFQ on reviewal not found');

    await this.verifyAdjustable(rfx);

    await this.rfxRepository.update(rfxId, { status: ERfxStatus.ADJUSTMENT });

    return rfx;
  }

  async submitRfx(rfxId: string): Promise<any> {
    const rfx = await this.getCompleteRfx(rfxId);

    this.validateRfxOnSubmit(rfx);

    const rfxPayload = {
      itemName: rfx.name,
      id: rfx.id,
      organizationId: rfx.organizationId,
      name: 'RFQApproval',
    };
    this.workflowRMQClient.emit('initiate-workflow', rfxPayload);

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

    const now = new Date();

    await this.updateRfxChildrenStatus(rfx.id, status);
    await this.rfxBidProcedureRepository.update(
      {
        id: rfx.rfxBidProcedure.id,
      },
      {
        invitationDate: now,
      },
    );

    if (status == 'APPROVED') {
      await this.solRoundService.createZeroSolicitationRound(
        rfx.rfxBidProcedure,
      );
      this.solRoundService.scheduleRoundOpening(rfx.id, 0);
    }
  }

  async submitForReview(rfxId: string, payload: UpdateRFXDto) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const rfx = await this.getCompleteRfx(rfxId);

    if (rfx.status != ERfxStatus.DRAFT && rfx.status != ERfxStatus.ADJUSTMENT)
      throw new BadRequestException('RFQ not draft or adjustment');

    this.validateRfxOnReview(rfx);

    const doc = await this.generateReviewDocument(rfx);

    await Promise.all([
      entityManager.getRepository(RFX).update(rfxId, {
        status: ERfxStatus.TEAM_REVIEWAL,
      }),
      entityManager.getRepository(RfxBidProcedure).update(
        {
          id: rfx.rfxBidProcedure.id,
        },
        {
          reviewDeadline: payload.reviewDeadline,
        },
      ),
      // TODO: Analysis ?
      entityManager.getRepository(RfxRevisionApproval).delete({
        rfxId,
      }),
    ]);

    return doc;
  }

  async validateUpdateRequest(rfx: RFX): Promise<any> {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    let canUpdate = false;

    if (rfx.status == ERfxStatus.DRAFT) return (canUpdate = true);

    if (
      rfx.status == ERfxStatus.TEAM_REVIEWAL &&
      rfx.revisionApprovals?.length == 0
    )
      return (canUpdate = true);

    const now = new Date();

    if (
      rfx.status == ERfxStatus.TEAM_REVIEWAL &&
      now > rfx.rfxBidProcedure.reviewDeadline
    ) {
      entityManager.getRepository(RFX).update(rfx.id, {
        status: ERfxStatus.ADJUSTMENT,
      });
      return (canUpdate = true);
    }

    if (rfx.status == ERfxStatus.ADJUSTMENT) return (canUpdate = true);

    if (!canUpdate) {
      throw new BadRequestException('rfx not updatable');
    }
  }

  async verifyAdjustable(rfx: RFX): Promise<boolean> {
    let canAdjust = false;
    if (
      rfx.revisionApprovals.some(
        (approval) => approval.status == ERfxRevisionApprovalStatusEnum.ADJUST,
      )
    )
      canAdjust = true;

    const now = new Date();

    if (now > rfx.rfxBidProcedure.reviewDeadline) canAdjust = true;

    if (rfx.revisionApprovals.length == 2) canAdjust = true;

    if (!canAdjust) {
      throw new BadRequestException('RFQ not adjustable');
    }
    return canAdjust;
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
      EMarketplaceBucketName.RFQ_PREPARATION_REVIEWAL_DOCUMENTS,
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

  async findOne(id: any, req?: any): Promise<any> {
    const rfx = await this.rfxRepository.findOne({
      where: {
        id,
      },
      relations: {
        rfxProcurementMechanism: true,
        rfxBidProcedure: true,
      },
    });
    if (!rfx) throw new BadRequestException('RFQ not found');

    return rfx;
  }

  async makeOpenRfx(rfxId: string) {
    const rfx = await this.rfxRepository
      .createQueryBuilder('rfxes')
      .where('rfxes.id = :rfxId', { rfxId })
      .andWhere('rfxes.status IN (:...status)', {
        status: [ERfxStatus.DRAFT, ERfxStatus.ADJUSTMENT],
      })
      .loadAllRelationIds({
        relations: ['items'],
      })
      .getOne();

    if (!rfx) throw new BadRequestException('Draft RFQ not found');

    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    await Promise.all([
      entityManager
        .getRepository(RfxProductInvitation)
        .delete({ rfxItemId: In(rfx.items) }),
      entityManager.getRepository(RFX).update(rfxId, {
        isOpen: true,
      }),
      entityManager.getRepository(RFXItem).update(
        {
          rfxId,
        },
        {
          status: ERfxItemStatus.INVITATION_PREPARED,
        },
      ),
    ]);
  }

  async getClosedRfx(query: CollectionQuery) {
    const dataQuery = QueryConstructor.constructQuery<RFX>(
      this.rfxRepository,
      query,
    );
    const now = new Date();

    dataQuery
      .andWhere('rfxes.status = :status', { status: ERfxStatus.APPROVED })
      .leftJoin('rfxes.rfxBidProcedure', 'rfxBidProcedure')
      .andWhere('rfxBidProcedure.submissionDeadline < :now', {
        now: now,
      });

    const response = new DataResponseFormat<RFX>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;
    }
    return response;
  }

  async makeCloseRfx(rfxId: string) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const rfxExists = await this.rfxRepository.exists({
      where: {
        id: rfxId,
        status: In([ERfxStatus.DRAFT, ERfxStatus.ADJUSTMENT]),
      },
    });

    if (!rfxExists) throw new BadRequestException('Draft RFQ not found');

    await Promise.all([
      entityManager.getRepository(RFX).update(rfxId, {
        isOpen: false,
      }),
      entityManager.getRepository(RFXItem).update(
        {
          rfxId,
        },
        {
          status: ERfxItemStatus.DRAFT,
        },
      ),
    ]);
  }

  async getRfxesOnReviewal(query: CollectionQuery, user) {
    const dataQuery = QueryConstructor.constructQuery<RFX>(
      this.rfxRepository,
      query,
    );

    const now = new Date();

    dataQuery
      .where('rfxes.status IN (:...statuses)', {
        statuses: [ERfxStatus.TEAM_REVIEWAL, ERfxStatus.ADJUSTMENT],
      })
      .leftJoin(
        'rfxes.rfxProcurementTechnicalTeams',
        'rfxProcurementTechnicalTeams',
      )
      .andWhere('rfxProcurementTechnicalTeams.userId = :userId', {
        userId: user.userId,
      });
    // .leftJoin('rfxes.rfxBidProcedure', 'rfxBidProcedures')
    // .andWhere('rfxBidProcedures.reviewDeadline > :now', {
    //   now,
    // });

    return await this.giveQueryResponse<RFX>(query, dataQuery);
  }

  async cancelRfx(rfxId: string) {
    const validStatuses = [
      ERfxStatus.APPROVED,
      ERfxStatus.AUCTION,
      ERfxStatus.EVALUATION,
      ERfxStatus.ENDED,
      ERfxStatus.SUBMITTED_EVALUATION,
    ];

    const rfx = await this.rfxRepository.findOne({
      where: {
        id: rfxId,
        // status: In(validStatuses),
      },
    });

    if (!rfx) throw new BadRequestException('RFQ not found');

    await Promise.all([
      this.updateRfxChildrenStatus(rfxId, 'CANCELLED'),
      await this.solRoundService.cancelPendingRounds(rfxId),
    ]);
  }

  async getPreparationRfxes(query: CollectionQuery, user: any) {
    const dataQuery = QueryConstructor.constructQuery<RFX>(
      this.rfxRepository,
      query,
    );

    dataQuery
      .where('rfxes.organizationId = :organizationId', {
        organizationId: user.organization.id,
      })
      .leftJoin(
        'rfxes.rfxProcurementTechnicalTeams',
        'rfxProcurementTechnicalTeams',
      )
      .andWhere('rfxProcurementTechnicalTeams.userId = :userId', {
        userId: user.userId,
      })
      .andWhere('rfxProcurementTechnicalTeams.isTeamLead = :isTeamLead', {
        isTeamLead: true,
      });

    return await this.giveQueryResponse<RFX>(query, dataQuery);
  }

  async getEvaluationRfxes(query: CollectionQuery, user: any) {
    const dataQuery = QueryConstructor.constructQuery<RFX>(
      this.rfxRepository,
      query,
    );

    dataQuery
      .where('rfxes.status = :status', { status: ERfxStatus.EVALUATION })
      .andWhere('rfxes.organizationId = :organizationId', {
        organizationId: user.organization.id,
      })
      .leftJoin('rfxes.teamMembers', 'teamMember')
      .andWhere('teamMember.personnelId = :personnelId', {
        personnelId: user.userId,
      });

    return await this.giveQueryResponse<RFX>(query, dataQuery);
  }

  async getAwardedRfxes(query: CollectionQuery, user: any) {
    const dataQuery = QueryConstructor.constructQuery<RFX>(
      this.rfxRepository,
      query,
    );

    dataQuery
      .where('rfxes.status = :status', { status: ERfxStatus.ENDED })
      .andWhere('rfxes.organizationId = :organizationId', {
        organizationId: user.organization.id,
      })
      .leftJoin(
        'rfxes.rfxProcurementTechnicalTeams',
        'rfxProcurementTechnicalTeams',
      );
    // .andWhere('rfxProcurementTechnicalTeams.userId = :userId', {
    //   userId: user.userId,
    // })
    // .andWhere('rfxProcurementTechnicalTeams.isTeamLead = :isTeamLead', {
    //   isTeamLead: true,
    // });

    return await this.giveQueryResponse<RFX>(query, dataQuery);
  }

  async getEvaluationApprovalRfxes(query: CollectionQuery, user: any) {
    const dataQuery = QueryConstructor.constructQuery<RFX>(
      this.rfxRepository,
      query,
    );

    dataQuery
      .where('rfxes.status = :status', {
        status: ERfxStatus.SUBMITTED_EVALUATION,
      })
      .andWhere('rfxes.organizationId = :organizationId', {
        organizationId: user.organization.id,
      });
    // .leftJoin('rfxes.evalApprovals', 'evalApproval')
    // .andWhere('evalApproval.evaluatorId = :userId', {
    //   userId: user.userId,
    // });

    return await this.giveQueryResponse<RFX>(query, dataQuery);
  }

  async canSubmitEvaluationApproval(rfxId: string, step: number, user: any) {
    const rfx = await this.rfxRepository.findOne({
      where: {
        id: rfxId,
        status: ERfxStatus.SUBMITTED_EVALUATION,
      },
      loadRelationIds: {
        relations: ['items'],
      },
      select: {
        id: true,
      },
    });

    if (!rfx) throw new BadRequestException('RFQ for evaluation not found');

    const workflowItem =
      await this.workflowItemService.getCurrentItemWithDetails(
        rfxId,
        step,
        user.userId,
      );

    const canComplete = rfx.items.every((itemId: any) =>
      workflowItem?.workflowItemDetails.some(
        (detail) => detail.itemId == itemId,
      ),
    );

    if (workflowItem?.isComplete) {
      return {
        canSubmit: false,
        reason: 'You have already submitted evaluation',
      };
    }

    if (!canComplete) {
      return {
        canSubmit: false,
        reason: 'You have not completed all items evaluation',
      };
    }

    return { canSubmit: true };
  }

  private async giveQueryResponse<T>(
    query: CollectionQuery,
    dataQuery: SelectQueryBuilder<T>,
  ) {
    const response = new DataResponseFormat<T>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;
    }
    return response;
  }

  private async getCompleteRfx(rfxId: string) {
    const rfx = await this.rfxRepository.findOne({
      where: {
        id: rfxId,
      },
      relations: {
        items: {
          rfxItemDocuments: true,
          rfxProductInvitations: true,
          technicalRequirement: true,
        },
        revisionApprovals: true,
        rfxBidContractCondition: true,
        rfxBidProcedure: true,
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

        await entityManager.getRepository(RfxProductInvitation).update(
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
      console.log(error);
    } finally {
      await queryRunner.release();
    }
  }

  private validateRfxOnSubmit(rfx: RFX) {
    if (rfx.status == ERfxStatus.DRAFT)
      throw new BadRequestException('RFQ not on team reviewal');

    if (rfx.status == ERfxStatus.ADJUSTMENT)
      throw new BadRequestException('RFQ not approved by team members');

    this.validateRfxOnReview(rfx);
    this.validateRfxReviewal(rfx);

    if (rfx.status != ERfxStatus.TEAM_REVIEWAL)
      throw new BadRequestException('RFQ not on reviewal');

    const now = new Date();

    if (
      rfx.status != ERfxStatus.TEAM_REVIEWAL &&
      now < rfx.rfxBidProcedure.reviewDeadline
    )
      throw new BadRequestException('RFQ review deadline has not ended');
  }

  private validateRfxOnReview(rfx: RFX) {
    if (rfx.rfxProcurementTechnicalTeams.length == 0) {
      throw new BadRequestException('RFQ procurement technical team not found');
    }
    if (!rfx.rfxBidContractCondition) {
      throw new BadRequestException('RFQ bid contract condition not found');
    }
    if (!rfx.rfxBidProcedure) {
      throw new BadRequestException('RFQ bid procedure not found');
    }
    if (!rfx.rfxProcurementMechanism) {
      throw new BadRequestException('RFQ procurement mechanism not found');
    }

    this.validateInvitation(rfx);

    return true;
  }

  private validateRfxReviewal(rfx: RFX) {
    const now = new Date();

    const revisions = rfx.revisionApprovals;

    if (now < rfx.rfxBidProcedure.reviewDeadline) {
      // if (revisions.length != 2)
      //   throw new BadRequestException('reviewal not ended');
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
}

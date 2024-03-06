import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { PostBudgetPlanActivity, ProcurementRequisition } from 'src/entities';
import { EntityCrudService } from 'src/shared/service';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { REQUEST } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ProcurementRequisitionService extends EntityCrudService<ProcurementRequisition> {
  constructor(
    @InjectRepository(ProcurementRequisition)
    private readonly repositoryProcurementRequisition: Repository<ProcurementRequisition>,
    @InjectRepository(ProcurementRequisition)
    private readonly repositoryPostBudgetPlanActivity: Repository<PostBudgetPlanActivity>,
    @Inject('PR_RMQ_SERVICE')
    private readonly prRMQClient: ClientProxy,

    private dataSource: DataSource,

    @Inject(REQUEST)
    private readonly request: Request,
  ) {
    super(repositoryProcurementRequisition);
  }

  async selectFromAPP(
    itemData: any,
    user: any,
  ): Promise<ProcurementRequisition> {
    const activity: any = await this.repositoryPostBudgetPlanActivity.findOne({
      where: {
        id: itemData.id,
        organizationId: user.organization.id,
        // status: 'Approved',
      },
      relations: [
        'postBudgetPlanItems',
        'postBudgetPlanTimelines',
        'postProcurementMechanisms',
      ],
    });
    const procurementRequisitionItems = [];
    activity.postBudgetPlanItems.forEach((item: any) => {
      procurementRequisitionItems.push({
        ...item,
        uom: item.uomName,
      });
    });
    const procurementRequisitionTimelines = [];
    activity.postBudgetPlanTimelines.forEach((timeline: any) => {
      procurementRequisitionTimelines.push({
        ...timeline,
      });
    });
    const procurementRequisition = {
      id: itemData.id,
      organization: user.organization.id,
      procurementRequisitionItems,
      procurementMechanism: activity.postProcurementMechanisms[0],
      procurementRequisitionTimelines,
    };
    const isFundAvailable = false; // TODO: check if fund is available
    activity.isFundAvailable = isFundAvailable;
    activity.isCustom = false;

    return this.repositoryProcurementRequisition.save(procurementRequisition);
  }

  async initiateWorkflow(data: any) {
    const pr = await this.repositoryProcurementRequisition.findOneOrFail({
      where: {
        id: data.id,
        organizationId: data.organizationId,
        status: 'Draft',
      },
      select: {
        id: true,
        name: true,
        organizationId: true,
      },
    });
    await this.repositoryProcurementRequisition.update(pr.id, {
      status: 'Submitted',
    });
    this.prRMQClient.emit('initiate-workflow', pr);
  }

  async prApprovalDecision(data: any): Promise<void> {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const sourceEntity =
      await this.repositoryProcurementRequisition.findOneOrFail({
        where: { id: data.itemId },
      });
    await entityManager
      .getRepository(ProcurementRequisition)
      .update(sourceEntity.id, {
        status: data.status,
      });
  }
}

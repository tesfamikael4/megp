import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { ProcurementRequisition } from 'src/entities';
import { EntityCrudService } from 'src/shared/service';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { REQUEST } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
@Injectable()
export class ProcurementRequisitionService extends EntityCrudService<ProcurementRequisition> {
  constructor(
    @InjectRepository(ProcurementRequisition)
    private readonly repositoryProcurementRequisition: Repository<ProcurementRequisition>,
    @Inject('PR_RMQ_SERVICE')
    private readonly prRMQClient: ClientProxy,

    private dataSource: DataSource,

    @Inject(REQUEST)
    private readonly request: Request,
  ) {
    super(repositoryProcurementRequisition);
  }

  async create(itemData: any, req?: any): Promise<ProcurementRequisition> {
    return super.create(itemData, req);
  }

  async initiateWorkflow(data: any): Promise<boolean> {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const prs = await this.repositoryProcurementRequisition.find({
      where: { id: data.id, status: 'Draft' },
      relations: ['procurementRequisitionActivities'],
    });

    for (const element of prs) {
      if (element.procurementRequisitionActivities.length == 0) {
        throw new HttpException(
          `Activity is not found for ${element.title} ${element.requisitionReferenceNumber}`,
          430,
        );
      }
    }

    await entityManager.getRepository(ProcurementRequisition).update(data.id, {
      status: 'Submitted',
    });
    const result = this.prRMQClient.emit('initiate-pr-workflow', {
      name: data.name,
      id: data.id,
      itemName: data.itemName,
      organizationId: data.organizationId,
    });
    result?.subscribe();
    return !!result;
  }

  async prApprovalDecision(data: any): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const sourceEntity =
        await this.repositoryProcurementRequisition.findOneOrFail({
          where: { id: data.itemId },
        });
      queryRunner.manager.connection.transaction(async (entityManager) => {
        await entityManager
          .getRepository(ProcurementRequisition)
          .update(sourceEntity.id, {
            status: data.status == 'Rejected' ? 'Draft' : 'Approved',
          });
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

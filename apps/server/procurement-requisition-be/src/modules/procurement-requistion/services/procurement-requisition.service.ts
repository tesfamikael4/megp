import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
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

  async importFromAPP(id: any, req?: any): Promise<ProcurementRequisition> {
    return super.create(id, req);
  }

  async getApp(id: any): Promise<any> {
    return id;
  }

  async initiateWorkflow(data: any) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    await entityManager.getRepository(ProcurementRequisition).update(data.id, {
      status: 'Submitted',
    });
    this.prRMQClient.emit('initiate-workflow', {
      name: data.name,
      id: data.id,
      itemName: data.itemName,
      organizationId: data.organizationId,
    });
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

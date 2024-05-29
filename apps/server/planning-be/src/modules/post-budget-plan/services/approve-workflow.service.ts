import { HttpException, Inject, Injectable, Scope } from '@nestjs/common';
import {
  PostBudgetPlan,
  PostProcurementMechanism,
  PreBudgetPlanActivity,
  PostBudgetRequisitioner,
  PostBudgetPlanActivity,
  PostBudgetPlanItem,
  PostBudgetPlanTimeline,
  PreBudgetPlan,
} from 'src/entities';
import { DataSource, EntityManager } from 'typeorm';
import { AllowAnonymous } from 'src/shared/authorization';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

@Injectable({ scope: Scope.DEFAULT })
export class WorkflowApproval {
  @Inject()
  private dataSource: DataSource;
  @AllowAnonymous()
  @RabbitSubscribe({
    exchange: 'workflow-broadcast-exchanges',
    routingKey: 'planning-workflow.postBudgetApproval',
    queue: 'planning-approval',
  })
  async approvePostBudget(data: any): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const entityManager: EntityManager = queryRunner.manager;

      const sourceEntity = await entityManager
        .getRepository(PostBudgetPlan)
        .findOneOrFail({
          where: { id: data.itemId },
        });

      //check Approval status and update the postBudgetPlan
      queryRunner.manager.connection.transaction(async (entityManager) => {
        await entityManager
          .getRepository(PostBudgetPlan)
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

  @AllowAnonymous()
  @RabbitSubscribe({
    exchange: 'workflow-broadcast-exchanges',
    routingKey: 'planning-workflow.preBudgetApproval',
    queue: 'planning-approval',
  })
  async copySelectedPreToPost(data: any): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const entityManager: EntityManager = queryRunner.manager;

      const sourceEntity = await entityManager
        .getRepository(PreBudgetPlan)
        .findOneOrFail({
          where: { id: data.itemId },
        });
      queryRunner.manager.connection.transaction(async (entityManager) => {
        await entityManager
          .getRepository(PreBudgetPlan)
          .update(sourceEntity.id, {
            status: data.status == 'Rejected' ? 'Draft' : 'Approved',
          });

        if (data.status == 'Approved') {
          const activities = await entityManager
            .getRepository(PreBudgetPlanActivity)
            .find({
              where: { preBudgetPlanId: data.itemId },
              relations: {
                preBudgetPlanItems: true,
                preBudgetPlanTimelines: true,
                preBudgetRequisitioners: true,
                preProcurementMechanism: true,
              },
            });

          if (activities.length == 0) {
            throw new HttpException(`Activity not found `, 430);
          }

          const postBudget = {
            ...sourceEntity,
            status: 'Draft',
            preBudgetPlanId: data.itemId,
            id: undefined,
          };
          await entityManager
            .getRepository(PostBudgetPlan)
            .insert(postBudget as any);

          const act: any = activities.map((activity) => ({
            ...activity,
            postBudgetPlanId: postBudget.id,
          }));

          await entityManager.getRepository(PostBudgetPlanActivity).insert(act);

          for (const element of act) {
            try {
              const item = element.preBudgetPlanItems.map((item) => ({
                ...item,
                postBudgetPlanActivityId: element.id,
                id: undefined,
              }));
              await entityManager
                .getRepository(PostBudgetPlanItem)
                .insert(item as any);

              if (element.preBudgetPlanTimelines.length == 0) {
                throw new HttpException(
                  `Timeline not found for ${element.name} ${element.procurementReference}`,
                  430,
                );
              }

              const time = element.preBudgetPlanTimelines.map((item) => ({
                ...item,
                postBudgetPlanActivityId: element.id,
                id: undefined,
              }));
              await entityManager
                .getRepository(PostBudgetPlanTimeline)
                .insert(time as any);

              const requisitioner = element.preBudgetRequisitioners.map(
                (item) => ({
                  ...item,
                  postBudgetPlanActivityId: element.id,
                  id: undefined,
                }),
              );
              await entityManager
                .getRepository(PostBudgetRequisitioner)
                .insert(requisitioner as any);

              const mechanism = {
                ...element.preProcurementMechanism,
                postBudgetPlanActivityId: element.id,
                id: undefined,
              };

              await entityManager
                .getRepository(PostProcurementMechanism)
                .insert(mechanism as any);
            } catch (error) {
              throw error;
            }
          }
        }
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

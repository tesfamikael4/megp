import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { DataSource, EntityManager, In, Not, Repository } from 'typeorm';
import { Step } from 'src/entities';
import { Instance } from 'src/entities/instance.entity';
import { Activity } from 'src/entities/activity.entity';
import { StateService } from './state.service';
import { State } from 'src/entities/state.entity';
import { ENTITY_MANAGER_KEY, EntityCrudService } from 'megp-shared-be';
import { InstanceStep } from 'src/entities/instance-step.entity';
import { REQUEST } from '@nestjs/core';
import { InstanceStepService } from './instance-step.service';

@Injectable()
export class InstanceService extends EntityCrudService<Instance> {
  constructor(
    @InjectRepository(Instance)
    private readonly repositoryInstance: Repository<Instance>,
    @InjectRepository(Step)
    private readonly repositoryStep: Repository<Step>,
    @InjectRepository(Activity)
    private readonly repositoryActivity: Repository<Activity>,
    @InjectRepository(State)
    private readonly repositoryState: Repository<State>,

    private readonly repositoryInstanceStepService: InstanceStepService,

    private readonly stateService: StateService,

    @Inject('WORKFLOW_RMQ_SERVICE')
    private readonly workflowRMQClient: ClientProxy,

    // @Inject(REQUEST)
    // private readonly request: Request,

    private connection: DataSource,
  ) {
    super(repositoryInstance);
    workflowRMQClient.connect();
  }
  // Listen
  async initiate(data, context) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const entityManager: EntityManager = queryRunner.manager;

      const act = await entityManager.getRepository(Activity).findOne({
        where: {
          name: data.name,
        },
      });
      const steps = await this.repositoryStep.find({
        where: { activityId: act.id, organizationId: data.organizationId },
        order: { order: 'ASC' },
      });

      const instanceSteps = steps.map((step) => {
        return { ...step, itemId: data.id };
      });
      const instanceStep = await this.repositoryInstanceStepService.bulkCreate(
        instanceSteps,
        entityManager,
      );

      const instanceState = await this.stateService.createState(
        act.id,
        data.organizationId,
        data.id,
        entityManager,
      );
      const createData = {
        itemId: data.id,
        itemName: data.itemName,
        organizationId: data.organizationId,
        activityId: act.id,
        status: instanceStep[0].name,
        instanceStepId: instanceStep[0].id,
        metadata: [],
        stateId: instanceState.id,
      };
      const instance = this.repositoryInstance.create(createData);
      return entityManager.getRepository(Instance).insert(instance);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async goto(data, organizationId: string) {
    const details = data.details;
    const goto = data.goto;
    const existingData = await this.findCurrentInstance(
      data.activityId,
      data.itemId,
      organizationId,
    );
    if (existingData) {
      existingData.metadata.push({
        userId: details.userId,
        actions: details.action,
        remark: details.remark,
        approver: details.approver,
        at: String(Date.now()),
        goto: goto.id,
        stepId: existingData.instanceStepId,
        version: existingData.version,
      });
      await this.repositoryInstance.update(existingData.id, {
        status: goto.status,
        instanceStepId: goto.id,
        version: existingData.version + 1,
        metadata: existingData.metadata,
      });
    }
  }

  async findOne(activityId: string, organizationId: string): Promise<Instance> {
    const instance = await this.repositoryInstance.findOne({
      where: { activityId, organizationId },
      relations: {
        instanceStep: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
    return instance;
  }

  async findCurrentInstanceByItemId(
    key: string,
    itemId: string,
    organizationId: string,
  ): Promise<Instance> {
    try {
      const activity = await this.repositoryActivity.findOne({
        where: {
          name: key,
        },
      });

      const instance = await this.repositoryInstance.findOne({
        where: {
          activityId: activity.id,
          organizationId,
          itemId: itemId,
          status: Not(In(['Rejected', 'Approved'])),
        },
        relations: {
          instanceStep: true,
        },
        order: {
          createdAt: 'DESC',
        },
      });
      return instance;
    } catch (e) {
      throw new Error(e);
    }
  }

  async findCurrentInstance(
    activityId: string,
    organizationId: string,
    itemId: string,
  ): Promise<Instance> {
    const instance = await this.repositoryInstance.findOne({
      where: { activityId, organizationId, itemId },
      relations: {
        instanceStep: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
    return instance;
  }

  async isActive(
    name: string,
    organizationId: string,
    itemId: string,
  ): Promise<Instance> {
    const activity = await this.repositoryActivity.findOne({
      where: {
        name,
      },
    });
    const instance = await this.repositoryInstance.findOne({
      where: {
        activityId: activity.id,
        organizationId,
        itemId,
        status: Not(In(['Rejected', 'Approved'])),
      },
      relations: {
        instanceStep: true,
      },
    });

    return instance;
  }

  async canSubmit(key: string, organizationId: string) {
    const activity = await this.repositoryActivity.findOne({
      where: {
        name: key,
      },
    });

    const stepsCount = await this.repositoryStep.count({
      where: {
        activityId: activity.id,
        organizationId,
      },
    });
    if (stepsCount > 0) {
      return true;
    }
    return false;
  }
}

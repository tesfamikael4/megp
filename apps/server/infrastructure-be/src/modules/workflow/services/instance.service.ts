import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { DataSource, EntityManager, In, Not, Repository } from 'typeorm';
import { Step, Workflow } from 'src/entities';
import { Instance } from 'src/entities/instance.entity';
import { Activity } from 'src/entities/activity.entity';
import { StateService } from './state.service';
import { State } from 'src/entities/state.entity';
import {
  CollectionQuery,
  DataResponseFormat,
  ENTITY_MANAGER_KEY,
  EntityCrudService,
  FilterOperators,
  QueryConstructor,
} from 'megp-shared-be';
import { InstanceStep } from 'src/entities/instance-step.entity';
import { REQUEST } from '@nestjs/core';
import { InstanceStepService } from './instance-step.service';
import axios from 'axios';

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

    private connection: DataSource,
  ) {
    super(repositoryInstance);
  }
  // Listen
  async initiate(data, context) {
    // const m = this.request;
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const entityManager: EntityManager = queryRunner.manager;

      const application = await entityManager.getRepository(Workflow).findOne({
        where: {
          name: data.application,
        },
      });
      const act = await entityManager.getRepository(Activity).findOne({
        where: {
          name: data.name,
        },
      });
      const steps = await entityManager.getRepository(Step).find({
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
        instanceStep,
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
      await entityManager.getRepository(Instance).insert(instance);
      await queryRunner.commitTransaction();
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

  async getWorkflowList(
    activityName: string,
    query: CollectionQuery,
    req: any,
  ) {
    const IAM_BASE_ENDPOINT =
      process.env.PR_BASE_ENDPOINT ??
      'https://dev-bo.megp.peragosystems.com/iam/api/';

    const request = await axios.get(
      `${IAM_BASE_ENDPOINT}users/get-user-for-infrastructure/${req.user.id}`,
      {
        headers: {
          'X-API-KEY':
            process.env.API_KEY ?? '25bc1622e5fb42cca3d3e62e90a3a20f',
        },
      },
    );

    const userDetailId = request.data;
    query.where.push([
      {
        column: 'metadata@>id',
        operator: FilterOperators.In,
        value: userDetailId.id,
      },
    ]);
    query.where.push([
      {
        column: 'status',
        operator: FilterOperators.NotIn,
        value: ['Approved', 'Rejected'],
      },
    ]);
    query.where.push([
      {
        column: 'activity.name',
        operator: FilterOperators.EqualTo,
        value: activityName,
      },
    ]);
    query.where.push([
      {
        column: 'instanceStep.approvers@>id',
        operator: FilterOperators.EqualTo,
        value: req.user.id,
      },
      {
        column: 'instanceStep.approvers@>id',
        operator: FilterOperators.In,
        value: userDetailId?.groupIds,
      },
      {
        column: 'instanceStep.approvers@>id',
        operator: FilterOperators.In,
        value: userDetailId?.rolesIds,
      },
    ]);
    query.includes.push('activity');
    query.includes.push('instanceStep');
    const dataQuery = QueryConstructor.constructQuery<Instance>(
      this.repositoryInstance,
      query,
    );

    const response = new DataResponseFormat<Instance>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;
    }
    return response;
  }
}

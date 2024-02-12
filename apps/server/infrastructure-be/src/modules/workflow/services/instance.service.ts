import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { In, Not, Repository } from 'typeorm';
import { Step } from 'src/entities';
import { Instance } from 'src/entities/instance.entity';
import { Activity } from 'src/entities/activity.entity';
import { StateService } from './state.service';
import { State } from 'src/entities/state.entity';
import { EntityCrudService } from 'megp-shared-be';
import { InstanceStep } from 'src/entities/instance-step.entity';

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
    @InjectRepository(InstanceStep)
    private readonly repositoryInstanceStep: Repository<InstanceStep>,

    private readonly stateService: StateService,

    @Inject('WORKFLOW_RMQ_SERVICE')
    private readonly workflowRMQClient: ClientProxy,
  ) {
    super(repositoryInstance);
    workflowRMQClient.connect();
  }
  // Listen
  async initiate(data) {
    const act = await this.repositoryActivity.findOne({
      where: {
        name: data.name,
      },
    });
    const steps = await this.repositoryStep.find({
      where: { activityId: act.id, organizationId: data.organizationId },
      order: { order: 'ASC' },
    });

    await this.repositoryInstanceStep.create({ ...steps, itemId: data.itemId });
    const instanceState = await this.stateService.createState(
      act.id,
      data.organizationId,
      data.id,
    );
    const createData = {
      itemId: data.id,
      itemName: data.itemName,
      organizationId: data.organizationId,
      activityId: act.id,
      status: steps[0].name,
      stepId: steps[0].id,
      metadata: [],
      stateId: instanceState.id,
    };
    const instance = this.repositoryInstance.create(createData);
    return this.repositoryInstance.save(instance);
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
        stepId: existingData.stepId,
        version: existingData.version,
      });
      await this.repositoryInstance.update(existingData.id, {
        status: goto.status,
        stepId: goto.id,
        version: existingData.version + 1,
        metadata: existingData.metadata,
      });
    }
  }

  async findOne(activityId: string, organizationId: string): Promise<Instance> {
    const instance = await this.repositoryInstance.findOne({
      where: { activityId, organizationId },
      relations: {
        step: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
    return instance;
  }

  async findCurrentInstance(
    activityId: string,
    organizationId: string,
    itemId: string,
  ): Promise<Instance> {
    const instance = await this.repositoryInstance.findOne({
      where: { activityId, organizationId, itemId },
      relations: {
        step: true,
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
        step: true,
      },
    });

    return instance;
  }
}

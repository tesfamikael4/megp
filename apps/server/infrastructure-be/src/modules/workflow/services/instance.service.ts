import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { Step } from 'src/entities';
import { Instance } from 'src/entities/instance.entity';
import { Activity } from 'src/entities/activity.entity';
import { StateService } from './state.service';
import { State } from 'src/entities/state.entity';
import { EntityCrudService } from 'src/shared/service';

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
    const createData = {
      itemId: data.id,
      itemName: data.itemName,
      organizationId: data.organizationId,
      activityId: act.id,
      status: steps[0].name,
      stepId: steps[0].id,
      metadata: [],
    };
    await this.stateService.createState(act.id, data.organizationId);

    const instance = this.repositoryInstance.create(createData);
    return this.repositoryInstance.save(instance);
  }

  async goto(activityId, details, goto) {
    const existingData = await this.repositoryInstance.findOne({
      where: { activityId: activityId },
    });
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

  async findOne(activityId: any, organizationId): Promise<Instance> {
    const instance = await this.repositoryInstance.findOne({
      where: { activityId: activityId, organizationId: organizationId },
      relations: {
        step: true,
      },
    });
    if (instance.stepId) {
      instance.step = await this.repositoryStep.findOne({
        where: { id: instance.stepId },
      });
    }
    return instance;
  }
}

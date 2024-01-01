import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { Step, Workflow } from 'src/entities';
import { EntityCrudService } from 'src/shared/service';
import { XMachineService } from './xMachine.service';
import { createActor } from 'xstate';
import { Instance } from 'src/entities/instance.entity';
import { Activity } from 'src/entities/activity.entity';
import { StateService } from './state.service';
import { State } from 'src/entities/state.entity';

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
  async initiate(name, itemId, itemName) {
    const act = await this.repositoryActivity.findOne({
      where: {
        name: name,
      },
    });
    const steps = await this.repositoryStep.find({
      where: { activityId: act.id },
      order: { order: 'ASC' },
    });
    const data = {
      itemId,
      itemName,
      activityId: act.id,
      status: steps[0].name,
      stepId: steps[0].id,
      metadata: [],
    };
    await this.stateService.createState(act.id);

    const instance = this.repositoryInstance.create(data);
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

  async findOne(id: any): Promise<Instance> {
    return await this.repositoryInstance.findOne({
      where: { activityId: id },
      relations: ['step'],
    });
  }
}

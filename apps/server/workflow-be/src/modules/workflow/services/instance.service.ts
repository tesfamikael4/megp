import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { Step, Workflow } from 'src/entities';
import { EntityCrudService } from 'src/shared/service';
import { XMachineService } from './xMachine.service';
import { createActor } from 'xstate';
import { Instance } from 'src/entities/instance.entity';

@Injectable()
export class InstanceService extends EntityCrudService<Instance> {
  constructor(
    @InjectRepository(Instance)
    private readonly repositoryInstance: Repository<Instance>,
    @InjectRepository(Step)
    private readonly repositoryStep: Repository<Step>,

    @Inject('WORKFLOW_RMQ_SERVICE')
    private readonly planningRMQClient: ClientProxy,
  ) {
    super(repositoryInstance);
    planningRMQClient.connect();
  }
  // Listen
  async initiate(activityId) {
    return 'initiated';
    const steps = await this.repositoryStep.find({ where: { activityId } });
    const data = {
      activityId,
      status: steps[0].name,
      stepId: steps[0].id,
    };
    const instance = this.repositoryInstance.create(data);
    return this.repositoryInstance.save(instance);
  }
  async findOne(id: any): Promise<Instance> {
    return await this.repositoryInstance.findOne({
      where: { activityId: id },
      relations: ['step'],
    });
  }

  async approveWorkflow() {
    this.planningRMQClient.emit('workflow-approved', {
      workflow: 'approved',
      activityId: '420f699d-5c87-47a9-91d6-cb74535a0730',
    });
  }
}

import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Workflow } from 'src/entities';
import { EntityCrudService } from 'megp-shared-be';
import { XMachineService } from './xMachine.service';
import { createActor } from 'xstate';
import { State } from 'src/entities/state.entity';
import { Instance } from 'src/entities/instance.entity';

@Injectable()
export class WorkflowService extends EntityCrudService<Workflow> {
  constructor(
    @InjectRepository(Workflow)
    private readonly repositoryWorkflow: Repository<Workflow>,
    @InjectRepository(Instance)
    private readonly repositoryInstance: Repository<Instance>,

    // @InjectRepository(State)
    // private readonly repositoryState: Repository<State>,

    private readonly xMachineService: XMachineService,
  ) {
    super(repositoryWorkflow);
  }

  async approveWorkflow(metaData: any, activityId: string, itemId: string) {
    const instance = await this.repositoryInstance.findOne({
      where: {
        activityId,
        organizationId: metaData.organizationId,
        itemId: itemId,
      },
      relations: {
        state: true,
      },
    });

    if (!instance) throw new Error('state not found');

    try {
      const workflowMachine = await this.xMachineService.createMachineConfig(
        activityId,
        metaData,
        instance.state.state,
      );
      const actor = createActor(workflowMachine);
      let currentState = '';
      actor.subscribe((states) => {
        currentState = states.value;
        console.log(states.value);
      });

      actor.start();
      actor.send({ type: `${metaData.name}.${metaData.action}` });

      return {
        status: 'success',
        workflowID: currentState,
        // init: workflowMachine.initialState,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }
}

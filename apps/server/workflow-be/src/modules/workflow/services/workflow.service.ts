import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Workflow } from 'src/entities';
import { EntityCrudService } from 'src/shared/service';
import { XMachineService } from './xMachine.service';
import { createActor } from 'xstate';

@Injectable()
export class WorkflowService extends EntityCrudService<Workflow> {
  constructor(
    @InjectRepository(Workflow)
    private readonly repositoryWorkflow: Repository<Workflow>,

    private readonly xMachineService: XMachineService,
  ) {
    super(repositoryWorkflow);
  }

  async approveWorkflow(workflowType, metaData, activityId) {
    try {
      const workflowMachine = await this.xMachineService.createMachineConfig(
        activityId,
        metaData.name,
      );
      const actor = createActor(workflowMachine);
      let currentState = '';
      actor.subscribe((state) => {
        currentState = state.value;
        console.log(state.value);
      });

      actor.start();
      actor.send({ type: `${metaData.name}.${metaData.action}` });

      return {
        status: 'success',
        workflowID: currentState,
        init: workflowMachine.initialState,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }
}

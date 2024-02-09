import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ExtraCrudService } from 'src/shared/service';
import { State } from 'src/entities/state.entity';
import { XMachineService } from './xMachine.service';
import { Step } from 'src/entities';
import { InstanceStep } from 'src/entities/instance-step.entity';

@Injectable()
export class StateService extends ExtraCrudService<State> {
  constructor(
    @InjectRepository(State)
    private readonly repositoryState: Repository<State>,
    // @InjectRepository(Step)
    // private readonly repositoryStep: Repository<Step>,
    private readonly xMachineState: XMachineService,
    @InjectRepository(InstanceStep)
    private readonly repositoryInstanceStep: Repository<InstanceStep>,
  ) {
    super(repositoryState);
  }

  // Listen
  async createState(
    activityId: string,
    organizationId: string,
    itemId: string,
  ): Promise<any> {
    const steps = await this.repositoryInstanceStep.find({
      where: { activityId, organizationId, itemId },
      order: { order: 'ASC' },
    });

    if (steps.length == 0) throw new Error('step not found');

    let state: any = await this.repositoryState.findOne({
      where: { activityId, organizationId },
    });

    if (!state) {
      const stateMachineConfig = this.xMachineState.createStateMachineConfig(
        steps as any,
      );
      state = stateMachineConfig.states;
      await this.repositoryState.insert({ state, activityId, organizationId });
    }
  }
}

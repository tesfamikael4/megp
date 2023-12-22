import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ExtraCrudService } from '../../../shared/service';
import { State } from 'src/entities/state.entity';
import { XMachineService } from './xMachine.service';
import { Step } from 'src/entities';

@Injectable()
export class StateService extends ExtraCrudService<State> {
  constructor(
    @InjectRepository(State)
    private readonly repositoryState: Repository<State>,
    @InjectRepository(Step)
    private readonly repositoryStep: Repository<Step>,
    private readonly xMachineState: XMachineService,
  ) {
    super(repositoryState);
  }

  // Listen
  async createState(activityId): Promise<any> {
    const steps = await this.repositoryStep.find({ where: { activityId } });

    if (steps.length == 0) throw new Error('step not found');

    let state: any = await this.repositoryState.findOne({
      where: { activityId },
    });

    if (!state) {
      const stateMachineConfig = this.xMachineState.createStateMachineConfig(
        steps as any,
      );
      state = stateMachineConfig.states;
      await this.repositoryState.insert({ state, activityId });
    }
  }
}

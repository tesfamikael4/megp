import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { ENTITY_MANAGER_KEY, ExtraCrudService } from 'megp-shared-be';
import { State } from 'src/entities/state.entity';
import { XMachineService } from './xMachine.service';
import { Step } from 'src/entities';
import { InstanceStep } from 'src/entities/instance-step.entity';
import { REQUEST } from '@nestjs/core';

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

    @Inject(REQUEST)
    private request: Request,
  ) {
    super(repositoryState);
  }

  // Listen
  async createState(
    activityId: string,
    organizationId: string,
    itemId: string,
  ): Promise<any> {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const steps = await this.repositoryInstanceStep.find({
      where: { activityId, organizationId, itemId },
      order: { order: 'ASC' },
    });

    if (steps.length == 0) throw new Error('step not found');

    let state: any = await this.repositoryState.findOne({
      where: { activityId, organizationId },
    });

    if (!state) {
      await entityManager
        .getRepository(State)
        .delete({ activityId, organizationId });
    }
    const stateMachineConfig = this.xMachineState.createStateMachineConfig(
      steps as any,
    );
    state = stateMachineConfig.states;
    const stateEntity = this.repositoryState.create({
      state,
      activityId,
      organizationId,
    });
    await entityManager.getRepository(State).insert(stateEntity);
    return stateEntity;
  }
}

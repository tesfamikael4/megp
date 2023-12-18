import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Step, Workflow } from 'src/entities';
import { Instance } from 'src/entities/instance.entity';
import { Repository } from 'typeorm';
import { and, setup } from 'xstate';

interface StateMachineConfig {
  states: {
    [key: string]:
      | {
          on: {
            [event: string]: {
              guard?: any;
              actions?: Array<{ type: string; params: { status: string } }>;
              target: string;
            };
          };
        }
      | { type: string };
  };
}

@Injectable()
export class XMachineService {
  constructor(
    @InjectRepository(Workflow)
    private readonly repositoryWorkflow: Repository<Workflow>,
    @InjectRepository(Step)
    private readonly repositoryStep: Repository<Step>,
    @InjectRepository(Instance)
    private readonly repositoryInstance: Repository<Instance>,
  ) {}

  async createMachineConfig(activityId, currentApprover: string): Promise<any> {
    const steps = await this.repositoryStep.find({ where: { activityId } });

    const stateMachineConfig = this.createStateMachineConfig(steps as any);

    const machine = setup({
      actions: {
        recordAction: async (_, params: any) => {
          const data = {
            status: params.status,
            activityId: activityId,
          };
          await this.repositoryInstance.upsert([data], {
            skipUpdateIfNoValuesChanged: true,
            conflictPaths: ['activityId'],
          });
        },
      },
      guards: {
        isApproved: ({ context }, params) => {
          return true;
        },
        isApprovedt: ({ context }, params) => {
          return true;
        },
      },
    }).createMachine({
      id: 'workflow',
      initial: `${currentApprover}App`,
      context: {},
      states: stateMachineConfig.states as any,
    });
    return machine;
  }

  private createStateMachineConfig(steps: any[]): StateMachineConfig {
    const stateMachineConfig: StateMachineConfig = { states: {} };

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const currentState = `${step.name}App`;

      stateMachineConfig.states[currentState] = {
        on: {
          [`${step.name}.Approved`]: {
            guard: and([
              { type: 'isApproved', params: { status: 'Approved' } },
              { type: 'isApproved', params: { status: 'Approved' } },
            ]),
            actions: [{ type: 'recordAction', params: { status: 'Approved' } }],
            target:
              i < steps.length - 1 ? `${steps[i + 1].name}App` : 'Approved',
          },
          [`${step.name}.reject`]: {
            target: i > 0 ? `${steps[i - 1].name}App` : currentState,
            actions: [{ type: 'recordAction', params: { status: 'Reject' } }],
          },
          [`${step.name}.Adjust`]: {
            target:
              i < steps.length - 1 ? `${steps[i + 1].name}App` : currentState,
            actions: [{ type: 'recordAction', params: { status: 'Adjust' } }],
          },
        },
      };
    }

    stateMachineConfig.states.Approved = { type: 'final' };

    return stateMachineConfig;
  }
}

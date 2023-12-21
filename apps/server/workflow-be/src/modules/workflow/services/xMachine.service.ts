import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Step, Workflow } from 'src/entities';
import { Instance } from 'src/entities/instance.entity';
import { State } from 'src/entities/state.entity';
import { Repository } from 'typeorm';
import { and, setup } from 'xstate';

interface StateMachineConfig {
  states: {
    [key: string]:
      | {
          on: {
            [event: string]: {
              guard?: any;
              actions?: Array<{
                type: string;
                params: { id: any; status: any };
              }>;
              target?: any;
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
    @InjectRepository(State)
    private readonly repositoryState: Repository<State>,
  ) {}

  async createMachineConfig(
    activityId,
    currentApprover: string,
    state,
  ): Promise<any> {
    const adjust = '';

    const machine = setup({
      actions: {
        recordAction: async ({ context, event }, params: any) => {
          console.log({ event });
          if (context.adj != '') {
            params.status = context.adj;
          }
          const data = {
            status: params.status,
            activityId: activityId,
            stepId: params.id,
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
      initial: `${currentApprover}`,
      context: {
        adj: adjust,
      },
      states: state,
    });
    return machine;
  }

  createStateMachineConfig(steps: any[]): StateMachineConfig {
    const stateMachineConfig: StateMachineConfig = { states: {} };

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const currentState = `${step.name}`;

      stateMachineConfig.states[currentState] = {
        on: {
          [`${step.name}.Approved`]: {
            guard: and([
              { type: 'isApproved', params: { status: 'Approved' } },
              { type: 'isApproved', params: { status: 'Approved' } },
            ]),
            actions: [
              {
                type: 'recordAction',
                params: {
                  id: i < steps.length - 1 ? steps[i + 1].id : step.id,
                  status:
                    i < steps.length - 1 ? `${steps[i + 1].name}` : 'Approved',
                },
              },
            ],
            target: i < steps.length - 1 ? `${steps[i + 1].name}` : 'Approved',
          },
          [`${step.name}.reject`]: {
            target: i > 0 ? `${steps[i - 1].name}` : currentState,
            actions: [
              {
                type: 'recordAction',
                params: {
                  id: i < steps.length - 1 ? steps[i + 1].id : step.id,
                  status: i > 0 ? `${steps[i - 1].name}` : 'Rejected',
                },
              },
            ],
          },
          [`${step.name}.Adjust`]: {
            // target: (context, event) => console.log({event}),
            actions: [
              {
                type: 'recordAction',
                params: {
                  id: i > 0 && i < steps.length - 1 ? steps[i + 1].id : step.id,
                  status: steps[0].name,
                  // i < steps.length - 1 ? `${steps[i + 1].name}` : 'Rejected',
                },
              },
            ],
          },
        },
      };
    }

    stateMachineConfig.states.Approved = { type: 'final' };

    return stateMachineConfig;
  }
}

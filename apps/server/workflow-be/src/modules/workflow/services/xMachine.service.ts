import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Step, Workflow } from 'src/entities';
import { Instance } from 'src/entities/instance.entity';
import { State } from 'src/entities/state.entity';
import { Repository } from 'typeorm';
import { setup } from 'xstate';
import axios from 'axios';
import { InstanceService } from './instance.service';

interface StateMachineConfig {
  states: {
    [key: string]:
      | {
          on: {
            [event: string]: {
              guard?: any | Promise<any>;
              actions?: Array<{
                type: string;
                params: { id: any; currentId?: any; status: any };
              }>;
              target?: any;
            };
          };
        }
      | { type: string | any };
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

    private readonly instanceService: InstanceService,
  ) {}

  async createMachineConfig(activityId, details, state): Promise<any> {
    const adjust = '';
    let isWorkGroup = {
      value: false,
      method: '',
    };
    let isAllChecked = false;
    const existingData = await this.repositoryInstance.findOne({
      where: { activityId: activityId },
    });

    isWorkGroup = await this.checkGroup(existingData.stepId);
    if (isWorkGroup.value) {
      isAllChecked = await this.canContinue(
        isWorkGroup,
        activityId,
        details.action,
      );
      if (!isAllChecked) {
        if (existingData) {
          existingData.metadata.push({
            userId: details.userId,
            actions: details.action,
            remark: details.remark,
            approver: details.approver,
            at: String(Date.now()),
            stepId: existingData.stepId,
          });
          await this.repositoryInstance.update(existingData.id, {
            metadata: existingData.metadata,
          });
        }
      }
    }
    const machine = setup({
      actions: {
        recordAction: async ({ context, event }, params: any) => {
          console.log({ event });
          if (context.adj != '') {
            params.status = context.adj;
          }
          if (existingData) {
            existingData.metadata.push({
              userId: details.userId,
              actions: details.action,
              remark: details.remark,
              approver: details.approver,
              at: String(Date.now()),
              stepId: params.currentId,
            });
            await this.repositoryInstance.update(existingData.id, {
              status: params.status,
              stepId: params.id,
              metadata: existingData.metadata,
            });
            if (params.status == 'Approved') {
              await this.instanceService.approveWorkflow({
                workflow: 'approved',
                activityId: activityId,
                itemId: existingData.itemId,
              });
            }
          } else {
            const data = {
              status: params.status,
              activityId: activityId,
              stepId: params.id,
              organizationId: details.organizationId,
              metadata: [
                {
                  userId: details.userId,
                  actions: details.action,
                  remark: details.remark,
                  approver: details.approver,
                  at: String(Date.now()),
                  stepId: params.id,
                },
              ],
            };

            await this.repositoryInstance.create(data);
          }
        },
      },
      guards: {
        isApproved: ({ context }, params) => {
          console.log({ context });
          console.log({ params });
          return isWorkGroup.value ? isAllChecked : true;
        },
      },
    }).createMachine({
      id: 'workflow',
      initial: `${details.name}`,
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
            // guard: and([
            //   { type: 'isApproved', params: { status: 'Approved' } }
            // ]),
            guard: 'isApproved',
            actions: [
              {
                type: 'recordAction',
                params: {
                  id: i < steps.length - 1 ? steps[i + 1].id : step.id,
                  currentId: i < steps.length - 1 && step.id,
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
            target: (context, event) => console.log({ event }),
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

    stateMachineConfig.states.Approved = { type: 'Approved' };
    stateMachineConfig.states.Rejected = { type: 'Rejected' };

    return stateMachineConfig;
  }

  private async checkGroup(stepId: any): Promise<any> {
    const currentStep = await this.repositoryStep.findOne({
      where: { id: stepId },
    });
    if (currentStep.approvers[0].approverType != 'WorkGroup') {
      return {
        value: false,
        method: currentStep.approvers[0].approvalMethod,
      };
    }
    return {
      value: true,
      method: currentStep.approvers[0].approvalMethod,
    };
  }

  async canContinue(info, activityId, action) {
    const existingData = await this.repositoryInstance.findOne({
      where: { activityId: activityId },
    });

    if (!existingData) {
      throw new Error('InstanceNotInitiated');
    }
    const currentStep = await this.repositoryStep.findOne({
      where: { id: existingData.stepId },
    });
    if (info.value && info.method == 'Consensus') {
      if (action == 'Reject') {
        return true;
      }

      const members = await this.getGroupMembers(currentStep.approvers[0].id);
      for (const member of members.items) {
        const user = existingData.metadata.find(
          (item) => item.userId === member.userId,
        );

        if (!(user && user.actions === 'Approved')) {
          return false;
        }
      }
    }
    if (info.value && info.method == 'Majority') {
      const members = await this.getGroupMembers(currentStep.approvers[0].id);
      let approvedMembers = 0;
      for (const member of members.items) {
        const user = existingData.metadata.find(
          (item) => item.userId === member.userId,
        );
        approvedMembers += 1;
        if (
          !(
            user &&
            user.action === 'Approved' &&
            approvedMembers > members.total / 2
          )
        ) {
          return false;
        }
      }
    }
    return true;
  }

  private async getGroupMembers(groupId) {
    const apiUrl = `https://dev-bo.megp.peragosystems.com/iam/api/user-groups/${groupId}/user`;

    try {
      const response = await axios.get(apiUrl);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

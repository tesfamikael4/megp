import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Step, Workflow } from 'src/entities';
import { Instance } from 'src/entities/instance.entity';
import { State } from 'src/entities/state.entity';
import { Repository } from 'typeorm';
import { setup } from 'xstate';
import axios from 'axios';
import { ClientProxy } from '@nestjs/microservices';
import { Activity } from 'src/entities/activity.entity';

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
    @InjectRepository(Step)
    private readonly repositoryStep: Repository<Step>,
    @InjectRepository(Instance)
    private readonly repositoryInstance: Repository<Instance>,
    @InjectRepository(Activity)
    private readonly repositoryActivity: Repository<Activity>,

    // private readonly instanceService: InstanceService,
    @Inject('WORKFLOW_RMQ_SERVICE')
    private readonly workflowRMQClient: ClientProxy,
  ) {}

  async createMachineConfig(activityId, details, state): Promise<any> {
    const adjust = '';
    let isWorkGroup = {
      value: false,
      method: '',
    };
    let isAllChecked = false;
    const existingData = await this.repositoryInstance.findOne({
      where: { activityId: activityId, organizationId: details.organizationId },
    });

    const ver =
      details.action == 'reject'
        ? existingData.version + 1
        : existingData.version;

    isWorkGroup = await this.checkGroup(existingData.stepId, details);
    if (isWorkGroup.value) {
      isAllChecked = await this.canContinue(isWorkGroup, activityId, details);
      if (!isAllChecked) {
        if (existingData) {
          existingData.metadata.push({
            userId: details.userId,
            actions: details.action,
            remark: details.remark,
            approver: details.approver,
            at: String(Date.now()),
            stepId: existingData.stepId,
            version: existingData.version,
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
              version: existingData.version,
            });

            await this.repositoryInstance.update(existingData.id, {
              status: params.status,
              stepId: params.id,
              version: ver,
              metadata: existingData.metadata,
            });
            if (params.status == 'Approved' || params.status == 'Rejected') {
              const acti = await this.repositoryActivity.findOne({
                where: { id: activityId },
              });
              this.workflowRMQClient.emit(`workflow-approval.${acti.name}`, {
                status: params.status,
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
                  stepId: params.currentId,
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
            guard: 'isApproved',
            actions: [
              {
                type: 'recordAction',
                params: {
                  id: i < steps.length - 1 ? steps[i + 1].id : null,
                  currentId: step.id,
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
                  id: i == 0 ? null : steps[i - 1].id,
                  currentId: step.id,
                  status: i == 0 ? 'Rejected' : `${steps[i - 1].name}`,
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

  private async checkGroup(stepId: any, details): Promise<any> {
    const currentStep = await this.repositoryStep.findOne({
      where: { id: stepId, organizationId: details.organizationId },
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

  async canContinue(info, activityId, details) {
    const existingData = await this.repositoryInstance.findOne({
      where: { activityId: activityId },
    });

    if (!existingData) {
      throw new Error('InstanceNotInitiated');
    }
    const currentStep = await this.repositoryStep.findOne({
      where: { id: existingData.stepId },
    });
    const prevMetadata = existingData.metadata.filter(
      (x) =>
        x.stepId == existingData.stepId && x.version == existingData.version,
    );
    const members = await this.getGroupMembers(currentStep.approvers[0].id);
    if (info.value && info.method == 'Consensus') {
      if (details.action == 'reject') {
        return true;
      }

      if (prevMetadata.length == members.total - 1) {
        return true;
      }
    }

    if (info.value && info.method == 'Majority') {
      const approvedCount = prevMetadata.filter(
        (x) => x.actions === 'Approved',
      ).length;
      const rejectMembers = prevMetadata.filter(
        (x) => x.actions === 'reject',
      ).length;

      details.action == 'reject' ? rejectMembers + 1 : approvedCount + 1;

      if (
        approvedCount > members.total / 2 ||
        rejectMembers > members.total / 2
      ) {
        return true;
      }
    }

    return false;
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

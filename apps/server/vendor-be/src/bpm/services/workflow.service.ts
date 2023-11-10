import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkflowInstanceEntity } from '../../handling/entities/workflow-instance';
import { WorkflowInstanceResponse } from '../../handling/dtos/workflow-instance.response';
import {
  CreateWorkflowInstanceDto,
  GotoNextStateDto,
  UpdateWorkflowInstanceDto,
} from '../../handling/dtos/workflow-instance.dto';
import {
  CreateTaskHandlerDto,
  TaskHandlerResponse,
} from '../dtos/task-handler.dto';

import { createMachine } from 'xstate';
import { TaskHandlerEntity } from '../entities/task-handler';
import { TaskEntity } from '../entities/task.entity';
import { TaskTypes } from '../dtos/task-type.enum';
import { StateMetaData } from '../dtos/state-metadata';
import { TaskTrackerEntity } from '../entities/task-tracker';
import {
  AssignmentEnum,
  BusinessStatusEnum,
  HandlerTypeEnum,
  WorkflowInstanceEnum,
} from '../../handling/dtos/workflow-instance.enum';
import { InvoiceEntity } from '../../handling/entities/invoice.entity';
import { HandlingCommonService } from '../../handling/services/handling-common-services';
import { BusinessProcessService } from 'src/bpm/services/business-process.service';
import { TaskService } from 'src/bpm/services/task.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
@Injectable()
export class WorkflowService {
  constructor(
    @InjectRepository(WorkflowInstanceEntity)
    private readonly workflowInstanceRepository: Repository<WorkflowInstanceEntity>,
    @InjectRepository(TaskHandlerEntity)
    private readonly handlerRepository: Repository<TaskHandlerEntity>,
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,
    @InjectRepository(TaskTrackerEntity)
    private readonly trackerRepository: Repository<TaskTrackerEntity>,
    private readonly bpService: BusinessProcessService,
    private readonly commonService: HandlingCommonService,
    private readonly taskService: TaskService,
    private readonly httpService: HttpService,
  ) { }
  async intiateWorkflowInstance(
    dto: CreateWorkflowInstanceDto,
    userInfo: any,
  ): Promise<any> {
    const response = {};
    const instanceEntity = CreateWorkflowInstanceDto.fromDto(dto);
    const serviceBp = await this.bpService.findWorkflowByServiceAndBP(
      dto.serviceId,
      dto.bpId,
    );
    if (!serviceBp || !dto.requestorId)
      throw new NotFoundException('Business Process Not Found');
    instanceEntity.applicationNumber =
      await this.commonService.generateApplicationNumber('PPDA', 'GNR');
    const wfinstance =
      await this.workflowInstanceRepository.save(instanceEntity);
    const machine = createMachine({
      predictableActionArguments: true,
      ...serviceBp.workflow,
    });
    const taskHandler = new TaskHandlerEntity();
    response['application'] = wfinstance;
    const init = machine.initial.toString();
    console.log(init);
    const task = await this.taskService.getTaskByNameAndBP(serviceBp.id, init);
    if (!task) throw new NotFoundException('Task Not found');
    taskHandler.currentState = init;
    taskHandler.instanceId = wfinstance.id;
    taskHandler.taskId = task.id;
    taskHandler.previousHandlerId = null;
    taskHandler.handlerName = null; //userInfo.name; //userMeta
    taskHandler.handlerUserId = null; // userInfo.userId;
    taskHandler.assignmentStatus = AssignmentEnum.Unpicked;
    taskHandler.data = { ...dto.data };
    try {
      const insertedTaskHandler =
        await this.handlerRepository.save(taskHandler);
      task.taskHandlers = [insertedTaskHandler];
      response['task'] = task;
    } catch (error) {
      console.log(error);
    }
    if (task.taskType == 'ISR') {
      const nextCommand = new GotoNextStateDto();
      nextCommand.instanceId = wfinstance.id;
      nextCommand.action = 'ISR';
      await this.gotoNextStep(nextCommand, userInfo);
    }
    return response;
  }
  async gotoNextStep(nextCommand: GotoNextStateDto, userInfo: any) {
    nextCommand.action = nextCommand.action.toUpperCase();
    const taskInfo = new TaskEntity();
    // let nextTask = {};
    const workflowInstance = await this.workflowInstanceRepository.findOne({
      relations: { businessProcess: true, taskHandler: true },
      where: { id: nextCommand.instanceId },
    });
    if (!workflowInstance || !workflowInstance.taskHandler)
      throw new NotFoundException('Workflow Instance not initiated Properly');
    const currentTaskHandler = workflowInstance.taskHandler;
    const currentTaskHandlerCopy = { ...workflowInstance.taskHandler };
    const bp = workflowInstance.businessProcess;
    const bpWorkflow = Object.assign({}, bp.workflow);
    bpWorkflow['initial'] = currentTaskHandler.currentState;
    const machine = createMachine({
      predictableActionArguments: true,
      ...bpWorkflow,
    });
    const curruntState = currentTaskHandler.currentState;
    const nextStepState = machine.transition(curruntState, nextCommand.action);
    if (nextStepState.value.toString() !== currentTaskHandler.currentState) {
      workflowInstance.status = WorkflowInstanceEnum.Inprogress;
      currentTaskHandler.currentState = nextStepState.value.toString();
      const stateMetaData = this.getStateMetaData(nextStepState.meta);
      if (stateMetaData['type'] == 'end') {
        workflowInstance.status = WorkflowInstanceEnum.Completed;
        workflowInstance.businessStatus = BusinessStatusEnum.active;
        const wfInstance = new UpdateWorkflowInstanceDto();
        wfInstance.requestorId = workflowInstance.requestorId;
        wfInstance.serviceId = workflowInstance.serviceId;
        wfInstance.bpId = workflowInstance.bpId;
        wfInstance.id = workflowInstance.id;
        console.log("stateMetaData['apiUrl']", stateMetaData['apiUrl']);
        const apiUrl = stateMetaData['apiUrl'];
        //  if (stateMetaData['apiUrl'])
        if (apiUrl) {
          const response = await this.notifyApplicationCompletion(
            wfInstance,
            stateMetaData['apiUrl'],
          );
          if (response) {
            await this.addTaskTracker(
              currentTaskHandler,
              nextCommand,
              userInfo,
            );
            await this.handlerRepository.delete(currentTaskHandler.id);
          }
        } else {
          await this.addTaskTracker(currentTaskHandler, nextCommand, userInfo);
          await this.handlerRepository.delete(currentTaskHandler.id);
        }
      } else {
        const task = await this.taskService.getTaskByNameAndBP(
          workflowInstance.bpId,
          nextStepState.value.toString(),
        );
        if (!task) throw new NotFoundException('Task not found');
        stateMetaData['type'] = task.taskType;
        taskInfo.handlerType = task.handlerType;
        taskInfo.taskType = task.taskType;
        //  nextTask = { ...taskInfo };
        await this.handleEvent(
          stateMetaData,
          nextCommand,
          task,
          workflowInstance,
        );
        const lastExecutedTask = await this.getPrviousHandler(
          workflowInstance.id,
        );
        const data = { remark: nextCommand.remark, ...nextCommand.data };
        currentTaskHandler.data = data;
        currentTaskHandler.taskId = task.id;
        currentTaskHandler.previousHandlerId = lastExecutedTask
          ? lastExecutedTask.handlerUserId
          : null;
        if (task.handlerType != HandlerTypeEnum.PreviousHandler) {
          currentTaskHandler.handlerUserId = null;
          currentTaskHandler.handlerName = null;
          currentTaskHandler.assignmentStatus = AssignmentEnum.Unpicked;
          currentTaskHandler.pickedAt = null;
        }
        await this.handlerRepository.save(currentTaskHandler);
        await this.addTaskTracker(
          currentTaskHandlerCopy,
          nextCommand,
          userInfo,
        );
      }
    }
    console.log('taskInfo-----', taskInfo);
    const result = await this.workflowInstanceRepository.save(workflowInstance);
    const workflow = WorkflowInstanceResponse.toResponse(result);
    if (taskInfo) {
      const handler = taskInfo.handlerType;
      const type = taskInfo.taskType;
      if (handler == HandlerTypeEnum.System) {
        const nextTaskdto = new GotoNextStateDto();
        nextTaskdto.action = type;
        nextTaskdto.instanceId = workflowInstance.id;
        await this.gotoNextStep(nextTaskdto, userInfo);
      }
    }
    return workflow;
  }

  private async saveWorkflowInstance(
    instanceEntity: WorkflowInstanceEntity,
  ): Promise<WorkflowInstanceEntity> {
    let wfinstance = new WorkflowInstanceEntity();
    try {
      instanceEntity.applicationNumber =
        await this.commonService.generateApplicationNumber('PPDA', 'GNR');
      wfinstance = await this.workflowInstanceRepository.save(instanceEntity);
    } catch (error) {
      await this.saveWorkflowInstance(instanceEntity);
      console.log(error);
    }
    return wfinstance;
  }
  private async getPrviousHandler(
    instanceId: string,
  ): Promise<TaskTrackerEntity> {
    const trackers = await this.trackerRepository.find({
      where: { instanceId: instanceId },
      order: { executedAt: 'DESC' },
    });
    if (trackers.length > 0) return trackers[0];
    return null;
  }

  async handleEvent(
    stateMetadata: StateMetaData,
    command: GotoNextStateDto,
    task: TaskEntity,
    wfi: WorkflowInstanceEntity,
  ) {
    const eventType = command.action ? command.action : 'SUBMIT';
    console.log('eventType', eventType);
    switch (stateMetadata.type.toLowerCase()) {
      case TaskTypes.APPROVAL:
        console.log(TaskTypes.APPROVAL, command);
        break;
      case TaskTypes.CONFIRMATION:
        // return this.confirm(command);
        break;
      case TaskTypes.SMS:
        await this.sendSMS(wfi);
        break;
      case TaskTypes.INVOICE:
        await this.generateInvoice(command.instanceId, task.id);
        break;
      case TaskTypes.CERTIFICATION:
        console.log(TaskTypes.CERTIFICATION, command);
        break;
      case TaskTypes.NOTIFICATION:
        console.log(TaskTypes.NOTIFICATION, command);
        break;
      case TaskTypes.PaymentConfirmation:
        console.log(TaskTypes.PaymentConfirmation, command);
        break;
      case TaskTypes.PAYMENT:
        const data = await this.invoiceRepository.find({
          where: { instanceId: command.instanceId },
        });
        data.map((row) => {
          row.paymentStatus = 'Paid';
          return this.invoiceRepository.update(row.id, row);
        });

        break;
    }
    return true;
  }

  async delete(id: string): Promise<any> {
    const workflowInstance = await this.workflowInstanceRepository.findOne({
      where: { id: id },
    });
    if (!workflowInstance)
      throw new NotFoundException('WorkflowInstance not found');
    return await this.workflowInstanceRepository.delete(id);
  }
  async addTaskHandler(
    dto: CreateTaskHandlerDto,
  ): Promise<TaskHandlerResponse> {
    const workflowInstance = await this.workflowInstanceRepository.findOne({
      where: { id: dto.instanceId },
    });
    if (!workflowInstance)
      throw new NotFoundException('WorkflowInstance not found');
    const handler = CreateTaskHandlerDto.fromDto(dto);
    const result = await this.handlerRepository.save(handler);
    return TaskHandlerResponse.toResponse(result);
  }
  async addTaskTracker(
    currentTaskHandlerCopy: TaskHandlerEntity,
    nextCommand: GotoNextStateDto,
    userInfo: any,
  ): Promise<boolean> {
    const entity = new TaskTrackerEntity();
    entity.taskId = currentTaskHandlerCopy.taskId;
    entity.instanceId = nextCommand.instanceId;
    entity.data = nextCommand.data;
    entity.handlerUserId = userInfo.userId;
    entity.action = nextCommand.action;
    entity.previousHandlerId = currentTaskHandlerCopy.previousHandlerId;
    entity.handlerName = userInfo.name;
    entity.pickedAt = currentTaskHandlerCopy.pickedAt;
    entity.checklists = nextCommand.taskChecklist;
    entity.remark = nextCommand.remark;
    entity.executedAt = new Date();
    try {
      await this.trackerRepository.insert(entity);
      return true;
    } catch (error) {
      throw new BadRequestException('Task tracker Not Saved ');
    }
  }

  async notifyApplicationCompletion(
    data: UpdateWorkflowInstanceDto,
    url: string,
  ) {
    // const url2 = 'http://localhost:3000/get-business-area-by-vendorId/' + data.requestorId;
    const payload = {
      vendorId: '6b31bfed-c359-1d2a-486d-585a3e4d4305',
      categoryId: '2c991afc-0e96-c72b-06f5-5c40514c38ae',
    };
    const config = {
      headers: {
        Authorization: 'Bearer yourAuthToken',
        'Other-Header': 'header-value',
      },
    };
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          url,
          payload,
          // config,
        ),
      );
      if (response.status === 201) {
        const responseData = response.data;
        return responseData;
      } else {
        throw new Error(`API returned status code ${response.status}`);
      }
    } catch (error) {
      console.error('Error making API request:', error);
      throw new Error('Error making API request');
    }
  }
  async sendEmail(data: any) {
    console.log('email sent', data);
  }
  async sendSMS(data: any) {
    console.log('email', data);
  }

  async generateInvoice(instanceId: string, taskId: string) {
    console.log('invoice', instanceId, taskId);
  }

  getStateMetaData(meta) {
    return Object.keys(meta).reduce((acc, key) => {
      const value = meta[key];
      // Assuming each meta value is an object
      Object.assign(acc, value);

      return acc;
    }, {});
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateWorkflowInstanceDto,
  GotoNextStateDto,
  UpdateWorkflowInstanceDto,
  WorkflowInstanceResponse,
} from '../../handling/dto/workflow-instance.dto';
import {
  CreateTaskHandlerDto,
  TaskHandlerResponse,
} from '../dto/task-handler.dto';
import { createMachine } from 'xstate';
import { TaskTypes } from '../dto/task-type.enum';
import { StateMetaData } from '../dto/state-metadata';
import {
  AssignmentEnum,
  BusinessStatusEnum,
  HandlerTypeEnum,
  WorkflowInstanceEnum,
} from '../../handling/dto/workflow-instance.enum';
import { HandlingCommonService } from '../../handling/services/handling-common-services';
import axios from 'axios';
import { InvoiceEntity } from 'src/entities/invoice.entity';
import { TaskTrackerEntity } from 'src/entities/task-tracker.entity';
import { BusinessProcessService } from './business-process.service';
import { TaskService } from './task.service';
import { TaskHandlerEntity } from 'src/entities/task-handler.entity';
import { TaskEntity } from 'src/entities/task.entity';
import { WorkflowInstanceEntity } from 'src/entities/workflow-instance.entity';
import { EmailService } from 'src/shared/email/email.service';
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
    private readonly emailSerice: EmailService,
  ) {}
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
  async gotoNextStep(nextCommand: GotoNextStateDto, user: any) {
    nextCommand.action = nextCommand.action.toUpperCase();
    const taskInfo = new TaskEntity();
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
        const apiUrl = stateMetaData['apiUrl'];
        if (apiUrl) {
          const response = await this.notifyApplicationCompletion(
            wfInstance,
            stateMetaData['apiUrl'],
          );
          if (response) {
            await this.addTaskTracker(currentTaskHandler, nextCommand, user);
            await this.handlerRepository.delete(currentTaskHandler.id);
          }
        } else {
          await this.addTaskTracker(currentTaskHandler, nextCommand, user);
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
        const status = await this.handleEvent(
          stateMetaData,
          nextCommand,
          task,
          workflowInstance,
          user,
        );
        if (!status) {
          throw new BadRequestException('Something went wrong');
        }
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
        await this.addTaskTracker(currentTaskHandlerCopy, nextCommand, user);
      }
    }
    const result = await this.workflowInstanceRepository.save(workflowInstance);
    const workflow = WorkflowInstanceResponse.toResponse(result);
    if (taskInfo) {
      const handler = taskInfo.handlerType;
      const type = taskInfo.taskType;
      if (handler == HandlerTypeEnum.System) {
        const nextTaskdto = new GotoNextStateDto();
        nextTaskdto.action = type;
        nextTaskdto.instanceId = workflowInstance.id;
        await this.gotoNextStep(nextTaskdto, user);
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
    user?: any,
  ) {
    switch (stateMetadata.type.toLowerCase()) {
      case TaskTypes.APPROVAL:
        return this.notify(wfi, stateMetadata['apiUrl'], command, user);
      case TaskTypes.EMAIl:
        return this.sendEmail(wfi, user['token']);
      case TaskTypes.SMS:
        return await this.sendSMS(wfi);
      case TaskTypes.INVOICE:
        return await this.generateInvoice(command.instanceId, task.id);
      case TaskTypes.CERTIFICATION:
        console.log(TaskTypes.CERTIFICATION, command);
        break;
      case TaskTypes.NOTIFICATION:
        console.log(TaskTypes.NOTIFICATION, command);
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
    const payload = {
      vendorId: data.requestorId,
      categoryId: '2c991afc-0e96-c72b-06f5-5c40514c38ae',
    };

    try {
      const response = await axios.post(url, payload);
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
  async notify(
    wfi: WorkflowInstanceEntity,
    url: string,
    metaDate: any,
    user: any,
  ) {
    const payload = {
      vendorId: wfi.requestorId,
      action: metaDate?.action,
      serviceId: wfi.serviceId,
      bpId: wfi.bpId,
      remark: metaDate.remark,
    };

    const accessToken = user['token'];
    try {
      const response = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 201) {
        const responseData = response.data;
        return responseData;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error making API request:', error);
      throw new Error('Error making API request');
    }
  }

  async sendEmail(wfi: any, accessToken?: string) {
    const vendor_url = process.env.VENDOR_API ?? '/vendors/api/';
    const url =
      vendor_url +
      '/vendor-registrations/get-isr-vendor-by-id/' +
      wfi.requestorId;
    console.log(url);
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log('response--', response);
      if (response.status === 200) {
        const responseData = response.data;
        const subject = 'subject of the email';
        const body = 'this is to inform you that';
        await this.emailSerice.sendEmail(
          'demeke.get23@gmail.com',
          subject,
          body,
        );
        return responseData;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error making API request:', error);
      throw new Error('Error making API request');
    }
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
      Object.assign(acc, value);
      return acc;
    }, {});
  }
}

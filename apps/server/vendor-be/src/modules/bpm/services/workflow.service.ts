import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { In, Repository } from 'typeorm';
import {
  CreateWorkflowInstanceDto,
  GotoNextStateDto,
  UpdateWorkflowInstanceDto,
  WorkflowInstanceResponse,
} from '../../handling/dto/workflow-instance.dto';
import { TaskHandlerResponse } from '../dto/task-handler.dto';
import { StateNode, createMachine } from 'xstate';
import { TaskTypes } from '../enums/task-type.enum';
import { StateMetaData } from '../dto/state-metadata';
import { HandlingCommonService } from '../../handling/services/handling-common-services';
import axios from 'axios';
import { BusinessProcessService } from './business-process.service';
import { TaskService } from './task.service';
import { EmailService } from 'src/shared/email/email.service';
import {
  BpServiceEntity,
  BusinessAreaEntity,
  TaskEntity,
  TaskHandlerEntity,
  TaskTrackerEntity,
  WorkflowInstanceEntity,
} from 'src/entities';
import { CollectionQuery, QueryConstructor } from 'src/shared/collection-query';
import { DataResponseFormat } from 'src/shared/api-data';
import { ActivityResponseDto } from '../dto/activities.dto';
import { TaskResponse } from '../dto/task.dto';
import { TaskTrackerResponse } from '../dto/task-tracker.dto';
import { VendorRegistrationsService } from 'src/modules/vendor-registration/services/vendor-registration.service';
import { BusinessAreaService } from 'src/modules/vendor-registration/services/business-area.service';
import { AssignmentEnum } from 'src/modules/handling/enums/assignment.enum';
import { HandlerTypeEnum } from 'src/modules/handling/enums/handler-type.enum';
import { ApplicationStatus } from 'src/modules/handling/enums/application-status.enum';
import { ServiceKeyEnum } from 'src/shared/enums/service-key.enum';
import { NotificationsService } from 'src/modules/notifications/services/notification.service';
// import { ServiceKeyEnum } from '../dto/workflow-instance.enum';
@Injectable()
export class WorkflowService {
  VENDOR_API_KEY: string;
  constructor(
    @InjectRepository(WorkflowInstanceEntity)
    private readonly workflowInstanceRepository: Repository<WorkflowInstanceEntity>,
    @InjectRepository(TaskHandlerEntity)
    private readonly handlerRepository: Repository<TaskHandlerEntity>,
    @InjectRepository(TaskTrackerEntity)
    private readonly trackerRepository: Repository<TaskTrackerEntity>,
    private readonly bpService: BusinessProcessService,
    private readonly commonService: HandlingCommonService,
    private readonly taskService: TaskService,
    private readonly emailService: EmailService,
    private readonly notificationService: NotificationsService,
    @Inject(forwardRef(() => VendorRegistrationsService))
    private readonly vendorRegService: VendorRegistrationsService,
    private readonly businessAreaService: BusinessAreaService,
  ) {
    this.VENDOR_API_KEY =
      process.env.VENDOR_API_ACCESS_KEY ??
      'dGtjFGcLjKU6pXRYx1tOnqGeycJtxJoavgwqYgDd';
  }
  getServiceCode(service: BpServiceEntity) {
    let code = '';
    if (service.key == ServiceKeyEnum.NEW_REGISTRATION) {
      code = 'NR';
    } else if (service.key == ServiceKeyEnum.REGISTRATION_RENEWAL) {
      code = 'RR';
    } else if (service.key == ServiceKeyEnum.REGISTRATION_UPGRADE) {
      code = 'RU';
    } else if (service.key == ServiceKeyEnum.PROFILE_UPDATE) {
      code = 'PU';
    } else if (
      this.commonService
        .getServiceCatagoryKeys(ServiceKeyEnum.PREFERENCTIAL)
        .some((item) => item == service.key)
    ) {
      code = 'PT';
    } else {
      throw new NotFoundException('Service code undefined');
    }
    return code;
  }
  async intiateWorkflowInstance(
    dto: CreateWorkflowInstanceDto,
    user: any,
  ): Promise<any> {
    const response = {};
    const instanceEntity = CreateWorkflowInstanceDto.fromDto(dto);
    instanceEntity.userId = user?.id;
    instanceEntity.user = user;
    const serviceBp = await this.bpService.findWorkflowByServiceAndBP(
      dto.serviceId,
      dto.bpId,
    );
    console.log('serviceBp', serviceBp);
    if (!serviceBp || !dto.requestorId)
      throw new NotFoundException('Business Process Not Found');
    const serviceCode = this.getServiceCode(serviceBp.service);
    instanceEntity.applicationNumber =
      await this.commonService.generateApplicationNumber('PPDA', serviceCode);
    const wfinstance =
      await this.workflowInstanceRepository.save(instanceEntity);
    const machine = createMachine({
      predictableActionArguments: true,
      ...serviceBp.workflow,
    });
    const taskHandler = new TaskHandlerEntity();
    response['application'] = wfinstance;
    const init = machine.initial.toString();
    const task = await this.taskService.getTaskByNameAndBP(serviceBp.id, init);
    if (!task) throw new NotFoundException('Task Not found');
    taskHandler.currentState = init;
    taskHandler.instanceId = wfinstance.id;
    taskHandler.taskId = task.id;
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
      nextCommand.data = { ...dto?.data };
      await this.gotoNextStep(nextCommand, user);
      await this.notificationService.sendSubmissionNotification(
        user.id,
        instanceEntity.applicationNumber,
        serviceBp.service.name,
      );
    }
    await this.vendorRegService.permitForOtherServiceRequest(
      wfinstance.requestorId,
    );
    return response;
  }
  async changeWorkflowInstanceStatus(status: string, instanceId: string) {
    const result = await this.workflowInstanceRepository.update(
      { id: instanceId },
      { status: status },
    );
    return result.affected;
  }
  async gotoNextStep(nextCommand: GotoNextStateDto, user: any) {
    nextCommand.action = nextCommand.action.toUpperCase();
    const taskInfo = new TaskEntity();
    const workflowInstance = await this.workflowInstanceRepository.findOne({
      relations: { businessProcess: { service: true }, taskHandler: true },
      where: { id: nextCommand.instanceId },
    });
    if (!workflowInstance || !workflowInstance.taskHandler)
      throw new NotFoundException('Workflow Instance not initiated Properly');
    const currentTaskHandler = workflowInstance.taskHandler;
    const currentTaskHandlerCopy = { ...workflowInstance.taskHandler };
    const currentTask = await this.taskService.findOne(
      currentTaskHandler.taskId,
    );
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
      workflowInstance.status = ApplicationStatus.INPROGRESS;
      currentTaskHandler.currentState = nextStepState.value.toString();
      const stateMetaData = this.getStateMetaData(nextStepState.meta);
      if (stateMetaData['type'] == 'end') {
        workflowInstance.status = ApplicationStatus.COMPLETED;
        // workflowInstance.businessStatus = BusinessStatusEnum.active;
        const wfInstance = new UpdateWorkflowInstanceDto();
        wfInstance.requestorId = workflowInstance.requestorId;
        wfInstance.serviceId = workflowInstance.serviceId;
        wfInstance.bpId = workflowInstance.bpId;
        wfInstance.id = workflowInstance.id;
        const apiUrl = stateMetaData['apiEndPoint'];
        wfInstance.user = workflowInstance.user;
        let response = false;
        if (
          currentTask.taskType == TaskTypes.INITIAL_REVIEW &&
          nextCommand.action.toUpperCase() ==
          ApplicationStatus.CANCEL.toUpperCase()
        ) {
          response = await this.vendorRegService.cancelApplication(
            wfInstance,
            nextCommand.remark,
          );
          await this.notificationService.sendCancelNotification(
            workflowInstance.userId,
            workflowInstance.applicationNumber,
            bp.service.name,
          );
        } else {
          response = await this.notifyCompletion(
            wfInstance,
            apiUrl,
            nextCommand,
          );
          if (
            nextCommand.action.toLowerCase ==
            ApplicationStatus.APPROVE.toLowerCase
          ) {
            await this.notificationService.sendCompletionNotification(
              workflowInstance.userId,
              workflowInstance.applicationNumber,
              bp.service.name,
            );
          } else {
            await this.notificationService.sendRejectNotification(
              wfInstance.userId,
              workflowInstance.applicationNumber,
              bp.service.name,
            );
          }
        }
        if (response) {
          await this.addTaskTracker(currentTaskHandler, nextCommand, user);
          await this.handlerRepository.delete(currentTaskHandler.id);
          workflowInstance.taskHandler = null;
          await this.vendorRegService.permitForOtherServiceRequest(
            workflowInstance.requestorId,
          );
        } else {
          throw new Error('Unable to update vender status');
        }
      } else {
        const task = await this.taskService.getTaskByNameAndBP(
          workflowInstance.bpId,
          nextStepState.value.toString(),
        );
        if (!task) throw new NotFoundException('Task not found');
        stateMetaData['type'] = currentTask.taskType;
        taskInfo.handlerType = task.handlerType;
        taskInfo.taskType = task.taskType;
        const notification = {
          userId: workflowInstance.userId,
          applicationNumber: workflowInstance?.applicationNumber,
          serviceName: bp.service?.name,
        };
        const status = await this.handleEvent(
          stateMetaData,
          nextCommand,
          currentTask,
          workflowInstance,
          user,
          notification,
        );

        if (!status) {
          throw new BadRequestException('Something went wrong');
        }
        const lastExecutedTask = await this.getPreviousHandler(
          workflowInstance.id,
        );
        const data = { remark: nextCommand.remark, ...nextCommand.data };
        const transferableData: any = { ...currentTaskHandlerCopy.data };
        const fileInfo: any = nextCommand?.data;
        data['documentId'] = fileInfo?.documentId ? fileInfo.documentId : transferableData?.documentId;
        data['fileId'] = fileInfo?.fileId ? fileInfo?.fileId : transferableData?.fileId
        currentTaskHandler.data = data;
        currentTaskHandler.taskId = task.id;
        currentTaskHandler.previousHandlerId = lastExecutedTask
          ? lastExecutedTask.handlerUserId
          : null;
        if (task.handlerType != HandlerTypeEnum.PREVIOUS_HANDLER) {
          currentTaskHandler.handlerUserId = null;
          currentTaskHandler.handlerUser = null;
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
      if (handler == HandlerTypeEnum.SYSTEM) {
        const nextTaskdto = new GotoNextStateDto();
        nextTaskdto.action = type;
        nextTaskdto.instanceId = workflowInstance.id;
        await this.gotoNextStep(nextTaskdto, user);
      }
    }
    workflow.businessArea =
      await this.businessAreaService.getBusinessAreaByInstanceId(
        nextCommand.instanceId,
      );
    return workflow;
  }

  async getActivities(instanceId: string) {
    const activities = [];
    const executedTasks = [];
    const wfi = await this.workflowInstanceRepository.findOne({
      relations: { taskHandler: true },
      where: { id: instanceId },
    });
    if (!wfi) throw new NotFoundException('Not Found');
    const tasks = await this.taskService.getTasksByBP(wfi.bpId);
    const completedTasks = await this.trackerRepository.find({
      where: { instanceId: instanceId },
      order: { executedAt: 'ASC' },
    });

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const activity = new ActivityResponseDto();
      activity.taskHandler = null;
      activity.taskTracker = null;
      activity.task = TaskResponse.toResponse(task);
      activity.task.taskCheckList = null;
      for (let index = 0; index < completedTasks.length; index++) {
        const element = completedTasks[index];
        console.log('element', element);
        if (
          element.taskId === task.id &&
          executedTasks.filter((row) => row.taskId == task.id).length == 0
        ) {
          activity.taskTracker = TaskTrackerResponse.toResponse(element);
          activity.taskTracker.data = null;
          executedTasks.push(element.taskId);
        }
      }
      if (task.id === wfi.taskHandler?.taskId) {
        const handler = wfi.taskHandler;
        handler.task = null;
        handler.workflowInstance = null;
        activity.taskHandler = TaskHandlerResponse.toResponse(handler);
      }
      activities.push(activity);
    }

    console.log('activities', activities);
    return activities;
  }

  private async getPreviousHandler(
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
    user: any,
    notification: any = null,
  ) {
    switch (stateMetadata.type.toLowerCase()) {
      case TaskTypes.APPROVAL:
        if (
          command.action.toUpperCase() ==
          ApplicationStatus.ADJUST.toUpperCase() ||
          command.action.toUpperCase() == 'NO'
        ) {
          const result = await this.notify(
            wfi,
            stateMetadata['apiUrl'],
            command,
          );
          if (notification) {
            await this.notificationService.sendAdjustmentNotification(
              notification.userId,
              notification.applicationNumber,
              notification.serviceName,
            );
          }

          if (result) {
            this.vendorRegService.permitForOtherServiceRequest(wfi.requestorId);
          }
        }
        break;
      case TaskTypes.INITIAL_REVIEW.toLowerCase():
        if (
          command.action.toUpperCase() == ApplicationStatus.ADJUST.toUpperCase()
        ) {
          const result = await this.notify(
            wfi,
            stateMetadata['apiUrl'],
            command,
          );
          if (notification) {
            this.notificationService.sendAdjustmentNotification(
              notification.userId,
              notification.applicationNumber,
              notification.serviceName,
            );
          }
          if (result) {
            await this.vendorRegService.permitForOtherServiceRequest(
              wfi.requestorId,
            );
          }
        }
        break;
      case TaskTypes.EMAIl:
        return this.sendEmail(wfi);
      case TaskTypes.SMS:
        return await this.sendSMS(wfi);
      case TaskTypes.INVOICE:
        return await this.generateInvoice(command.instanceId, task.id);
      case TaskTypes.CERTIFICATION:
        console.log(TaskTypes.CERTIFICATION, command);
        break;
      case TaskTypes.NOTIFICATION:
        console.log(TaskTypes.NOTIFICATION, command);
      case TaskTypes.PAYMENTCONFIRMATION:
        console.log(TaskTypes.PAYMENTCONFIRMATION, command);
        break;
      case TaskTypes.PAYMENT:
        break;
      case TaskTypes.CONFIRMATION:
        if (
          command.action.toUpperCase() == 'NO'
          // ||  command.action.toUpperCase() == ReviewStatus.Reject.toUpperCase()
        ) {
          const result = await this.notify(
            wfi,
            stateMetadata['apiUrl'],
            command,
          );
          if (notification) {
            this.notificationService.sendAdjustmentNotification(
              notification.userId,
              notification.applicationNumber,
              notification.serviceName,
            );
          }

          if (result) {
            await this.vendorRegService.permitForOtherServiceRequest(
              wfi.requestorId,
            );
          }
        }
        break;
    }
    return true;
  }

  async addTaskTracker(
    currentTaskHandlerCopy: TaskHandlerEntity,
    nextCommand: GotoNextStateDto,
    user: any,
  ): Promise<boolean> {
    const entity = new TaskTrackerEntity();
    entity.taskId = currentTaskHandlerCopy.taskId;
    entity.instanceId = nextCommand.instanceId;
    entity.data = nextCommand.data;
    entity.handlerUserId = user.id;
    entity.action = nextCommand.action;
    entity.previousHandlerId = currentTaskHandlerCopy.previousHandlerId;
    entity.handlerUser = user;
    //entity.handlerUser?.user?.token=null;
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

  async notifyCompletion(
    wfi: UpdateWorkflowInstanceDto,
    url: string,
    command: any,
  ) {
    const commandLower = command.action.toLowerCase();
    const status =
      commandLower == 'approve' ||
        commandLower == 'yes' ||
        commandLower == 'success'
        ? 'Approve'
        : 'Reject';
    const payload = {
      isrVendorId: wfi.requestorId,
      instanceId: wfi.id,
      serviceId: wfi.serviceId,
      status: status,
      userId: wfi.user.id,
      remark: command.remark,
      category: '',
    };
    console.log('payload', payload);
    try {
      const result = await this.vendorRegService.updateVendor(payload);

      if (result) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw error;
    }

    /*
        const vendor_url = process.env.VENDOR_API ?? '/vendors/api/';
        url = vendor_url + '/vendor-registrations/update-vendor-services';
    
        const headers = {
          'Content-Type': 'application/json',
          'x-api-key': this.VENDOR_API_KEY,
        }
        try {
          const response = await axios.post(url, payload, {
            headers,
          });
          console.log('response  -- ', response);
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
        */
  }
  async notify(wfi: WorkflowInstanceEntity, url: string, metaDate: any) {
    // const vendor_url = process.env.VENDOR_API ?? '/vendors/api/';
    // url = vendor_url + '/vendor-registrations/adjust-vendor-services';
    // console.log("vendor_url", vendor_url);
    const action =
      metaDate.action == 'ADJUST' || metaDate.action == 'NO' ? 'Adjust' : '';
    const payload = {
      isrVendorId: wfi.requestorId,
      instanceId: wfi.id,
      status: action,
      serviceId: wfi.serviceId,
      remark: metaDate.remark,
      userId: wfi.userId,
      category: '',
    };
    console.log('payload ', payload);
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': this.VENDOR_API_KEY,
    };
    // headers: {
    //   'Content-Type': 'application/json',
    //     Authorization: `Bearer ${accessToken}`,
    //     }
    //
    const result = await this.vendorRegService.adjustVendor(payload);

    if (result) {
      return true;
    } else {
      return false;
    }
    /*
        try {
          const response = await axios.post(url, payload, { headers });
          console.log('response-----', response);
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
        */
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
        await this.emailService.sendEmail(
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

  async countStates(stateNode: StateNode): Promise<number> {
    let count = 1;
    if (stateNode.states) {
      for (const childStateNode of Object.values(stateNode.states)) {
        count += await this.countStates(childStateNode);
      }
    }
    return count;
  }
  async getCurruntCustomerTask(
    query: CollectionQuery,
    user: any,
  ): Promise<DataResponseFormat<WorkflowInstanceResponse>> {
    const dataQuery = QueryConstructor.constructQuery<WorkflowInstanceEntity>(
      this.workflowInstanceRepository,
      query,
    );
    dataQuery
      .innerJoinAndSelect('workflow_instances.taskHandler', 'handler')
      .innerJoinAndSelect('handler.task', 'task')
      .innerJoinAndSelect('workflow_instances.service', 'service')
      .andWhere('workflow_instances.userId=:userId', { userId: user.id })
      .andWhere('task.handlerType=:handlerType', { handlerType: 'Requestor' })
      .orderBy('workflow_instances.submittedAt', 'DESC');
    const d = new DataResponseFormat<WorkflowInstanceResponse>();
    const [result, total] = await dataQuery.getManyAndCount();
    d.items = result.map((entity) =>
      WorkflowInstanceResponse.toResponse(entity),
    );
    d.total = total;
    return d;
  }
  getInstance(id: string) {
    return this.workflowInstanceRepository.findOne({ where: { id: id } });
  }
  async getRequestedAppByVendorId(requestorId: string) {
    return await this.workflowInstanceRepository.findOne({
      relations: { service: true },
      where: { requestorId: requestorId, status: ApplicationStatus.INPROGRESS },
    });
  }

  getStateMetaData(meta) {
    return Object.keys(meta).reduce((acc, key) => {
      const value = meta[key];
      Object.assign(acc, value);
      return acc;
    }, {});
  }

  async getMyApplications(user: any): Promise<any> {
    const result = await this.workflowInstanceRepository
      .createQueryBuilder('wf')
      .innerJoinAndMapOne(
        'wf.businessArea',
        BusinessAreaEntity,
        'ba',
        'wf.id = ba.instanceId',
      )
      .innerJoinAndSelect('wf.service', 'service')
      .innerJoinAndSelect('wf.taskTrackers', 'trak')
      .where('wf.userId = :userId', { userId: user.id })
      .andWhere('ba.status In(:...statuses)', {
        statuses: [
          ApplicationStatus.APPROVED,
          ApplicationStatus.ADJUSTMENT,
          ApplicationStatus.REJECTED,
          ApplicationStatus.PENDING,
          ApplicationStatus.CANCELED,
        ],
      })
      .orderBy('wf.updatedAt', 'DESC')
      .addOrderBy('trak.executedAt', 'DESC')
      .getMany();
    return result;
  }
}

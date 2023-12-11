import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { DataResponseFormat } from 'src/shared/api-data';
import { CollectionQuery, QueryConstructor } from 'src/shared/collection-query';
import {
  CreateWorkflowInstanceDto,
  GotoNextStateDto,
  UpdateWorkflowInstanceDto,
  WorkflowInstanceResponse,
} from '../dto/workflow-instance.dto';
import { createMachine, interpret } from 'xstate';
import { ServicePrice } from 'src/entities/service-price.entity';
import {
  AssignmentEnum,
  BusinessStatusEnum,
  HandlerTypeEnum,
  ServiceKeyEnum,
  WorkflowInstanceEnum,
} from '../dto/workflow-instance.enum';
import {
  PaymentReceiptDto,
  PaymentReceiptResponseDto,
} from 'src/modules/vendor-registration/dto/payment-receipt.dto';
import { InvoiceResponseDto } from 'src/modules/vendor-registration/dto/invoice.dto';
import { VendorsResponseDto } from 'src/modules/vendor-registration/dto/vendor.dto';
import { HandlingCommonService } from './handling-common-services';
import { TaskHandlerEntity } from 'src/entities/task-handler.entity';
import { TaskTrackerEntity } from 'src/entities/task-tracker.entity';
import { TaskService } from 'src/modules/bpm/services/task.service';
import { InvoiceEntity } from 'src/entities/invoice.entity';
import { PaymentReceiptEntity } from 'src/entities/receipt-attachment.entity';
import { BusinessProcessService } from 'src/modules/bpm/services/business-process.service';
import {
  CreateTaskHandlerDto,
  TaskHandlerResponse,
} from 'src/modules/bpm/dto/task-handler.dto';
import { TaskTypes } from 'src/modules/bpm/dto/task-type.enum';
import { StateMetaData } from 'src/modules/bpm/dto/state-metadata';
import { CreateTaskTrackerDto } from 'src/modules/bpm/dto/task-tracker.dto';
import { WorkflowInstanceEntity } from 'src/entities/workflow-instance.entity';
import { TaskEntity } from 'src/entities/task.entity';
import { IsrVendorsEntity, VendorsEntity } from 'src/entities';
@Injectable()
export class WorkflowInstanceService {
  constructor(
    @InjectRepository(WorkflowInstanceEntity)
    private readonly workflowInstanceRepository: Repository<WorkflowInstanceEntity>,
    private readonly taskService: TaskService,
    @InjectRepository(ServicePrice)
    private readonly pricingRepository: Repository<ServicePrice>,
    @InjectRepository(TaskHandlerEntity)
    private readonly handlerRepository: Repository<TaskHandlerEntity>,
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,
    @InjectRepository(TaskTrackerEntity)
    private readonly trackerRepository: Repository<TaskTrackerEntity>,
    @InjectRepository(VendorsEntity)
    private readonly vendorRepository: Repository<VendorsEntity>,
    @InjectRepository(IsrVendorsEntity)
    private readonly isrVendorRepository: Repository<IsrVendorsEntity>,
    @InjectRepository(PaymentReceiptEntity)
    private readonly receiptRepository: Repository<PaymentReceiptEntity>,
    private readonly bpService: BusinessProcessService,
    private readonly commonService: HandlingCommonService,
  ) { }

  async submitFormBasedTask(
    nextCommand: GotoNextStateDto,
    userInfo: any,
  ): Promise<WorkflowInstanceResponse> {
    const response = new WorkflowInstanceResponse();
    return response;
  }

  async getWorkflowInstances(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<WorkflowInstanceResponse>> {
    const dataQuery = QueryConstructor.constructQuery<WorkflowInstanceEntity>(
      this.workflowInstanceRepository,
      query,
    );
    const response = new DataResponseFormat<WorkflowInstanceResponse>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result.map((entity) =>
        WorkflowInstanceResponse.toResponse(entity),
      );
    }
    return response;
  }

  async create(
    dto: CreateWorkflowInstanceDto,
    userInfo: any = {},
  ): Promise<any> {
    const response = {};
    const instanceEntity = CreateWorkflowInstanceDto.fromDto(dto);
    const serviceBp = await this.bpService.findWorkflowByServiceAndBP(
      dto.serviceId,
      dto.bpId,
    );
    if (!serviceBp || !dto.requestorId)
      throw new NotFoundException('Business Process Not Found');
    console.log('instanceEntity--before save', instanceEntity);
    instanceEntity.applicationNumber =
      await this.commonService.generateApplicationNumber('PPDA', 'GNR');
    const wfinstance = await this.workflowInstanceRepository.save(
      instanceEntity,
    );
    const machine = createMachine({
      predictableActionArguments: true,
      ...serviceBp.workflow,
    });
    const taskHandler = new TaskHandlerEntity();
    response['application'] = wfinstance;
    const stateMachine = interpret(machine).onTransition(async (state) => {
      const task = await this.taskService.getTaskByNameAndBP(
        serviceBp.id,
        state.value.toString(),
      );
      console.log('serviceBp ', serviceBp);
      console.log(
        'serviceBp.id, state.value.toString()',
        serviceBp.id,
        state.value.toString(),
      );
      // const task = await this.taskRepository.findOne({
      //   where: { bpId: serviceBp.id, name: state.value.toString() },
      // });
      if (!task) throw new NotFoundException('Task Not found');

      taskHandler.currentState = state.value.toString();
      taskHandler.instanceId = wfinstance.id;
      taskHandler.taskId = task.id;
      taskHandler.previousHandlerId = null;
      taskHandler.handlerUser = userInfo; //userMeta
      taskHandler.handlerUserId = userInfo.userId;
      taskHandler.assignmentStatus = AssignmentEnum.Unpicked;
      taskHandler.data = { ...dto.data };
      try {
        const insertedTaskHandler = await this.handlerRepository.save(
          taskHandler,
        );
        task.taskHandlers = [insertedTaskHandler];
        response['task'] = task;
        console.log('handler repository');
      } catch (error) {
        console.log(error);
      }
    });

    stateMachine.start();
    stateMachine.stop();
    return response;
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
      //this.saveWorkflowInstance(instanceEntity);
      console.log(error);
    }
    return wfinstance;
  }

  async gotoNextStep(nextCommand: GotoNextStateDto, user?: any) {
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
    const stateMachine = interpret(machine).onTransition(async (state) => {
      if (state.value !== currentTaskHandler.currentState) {
        workflowInstance.status = WorkflowInstanceEnum.Inprogress;
        currentTaskHandler.currentState = state.value.toString();
        const stateMetaData = this.getStateMetaData(state.meta);
        if (stateMetaData['type'] == 'end') {
          workflowInstance.status = WorkflowInstanceEnum.Completed;
          workflowInstance.businessStatus = BusinessStatusEnum.active;
          //update vendor status approved
          const vendor = await this.vendorRepository.findOne({
            where: { id: workflowInstance.requestorId },
          });
          vendor.status = WorkflowInstanceEnum.Approved;
          await this.vendorRepository.save(vendor);
          await this.addTaskTracker({
            taskId: currentTaskHandler?.taskId,
            instanceId: workflowInstance?.id,
            data: nextCommand?.data,
            action: nextCommand?.action,
            previousHandlerId: currentTaskHandler?.id,
            handlerUser: currentTaskHandler.handlerUser,
            handlerUserId: currentTaskHandler.handlerUserId,
            pickedAt: currentTaskHandler.pickedAt
              ? currentTaskHandler.pickedAt
              : new Date(),
            checkLists: nextCommand.taskChecklist,
            executedAt: new Date(),
            remark: nextCommand.remark,
          });
          await this.handlerRepository.delete(currentTaskHandler.id);
        } else {
          const task = await this.taskService.getTaskByNameAndBP(
            workflowInstance.bpId,
            state.value.toString(),
          );
          if (!task) {
            throw new NotFoundException('Task not found');
          }
          stateMetaData['type'] = task.taskType;
          taskInfo.handlerType = task.handlerType;
          taskInfo.taskType = task.taskType;
          // await this.handleEvent(stateMetaData, nextCommand, task.id);
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
            currentTaskHandler.handlerUser = null;
            currentTaskHandler.assignmentStatus = AssignmentEnum.Unpicked;
            currentTaskHandler.pickedAt = null;
          }
          await this.handlerRepository.save(currentTaskHandler);
          await this.addTaskTracker({
            taskId: currentTaskHandlerCopy.taskId,
            instanceId: workflowInstance.id,
            data: nextCommand.data,
            handlerUserId: user?.id,
            action: nextCommand.action,
            previousHandlerId: currentTaskHandlerCopy.previousHandlerId,
            handlerUser: user,
            pickedAt: currentTaskHandlerCopy.pickedAt,
            checkLists: nextCommand.taskChecklist,
            remark: nextCommand.remark,
            executedAt: new Date(),
          });
        }
      }
    });

    stateMachine.start();
    stateMachine.send(nextCommand.action);
    stateMachine.stop();
    const result = await this.workflowInstanceRepository.save(workflowInstance);
    return WorkflowInstanceResponse.toResponse(result);
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
  async getTaskById(id: string): Promise<TaskEntity> {
    return await this.taskService.findOne(id);
  }

  async handleEvent(
    stateMetadata: StateMetaData,
    command: GotoNextStateDto,
    taskId: string,
  ) {
    const eventType = command.action ? command.action : 'SUBMIT';
    console.log('eventType', eventType);
    switch (stateMetadata.type.toLocaleLowerCase()) {
      case TaskTypes.APPROVAL:
        console.log(TaskTypes.APPROVAL, command);
        break;
      case TaskTypes.CONFIRMATION:
        // return this.confirm(command);
        break;
      case TaskTypes.REVIEW:
        // return this.approve(command);
        break;
      case TaskTypes.INVOICE:
        // await this.generateInvoice(command.instanceId, taskId);
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
      case TaskTypes.ISR:
        console.log(TaskTypes.ISR, command);
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

  async reviewApplication(
    command: GotoNextStateDto,
    userInfo: any,
  ): Promise<WorkflowInstanceResponse> {
    const eventType = command.action ? command.action : 'SUBMIT';
    const instance = await this.workflowInstanceRepository.findOne({
      relations: { taskHandler: true },
      where: { id: command.instanceId },
    });
    const handler = { ...instance.taskHandler };
    handler.handlerUserId = userInfo.userId;
    handler.handlerUser = userInfo;
    if (eventType.toLowerCase() === 'adjust') {
      instance.status = WorkflowInstanceEnum.Draft;
    } else if (eventType.toLowerCase() === 'approve') {
      instance.status = WorkflowInstanceEnum.Inprogress;
    } else if (eventType.toLowerCase() === 'reject') {
      instance.status = WorkflowInstanceEnum.Rejected;
    } else {
      throw new BadRequestException('Unknown Command');
    }
    await this.workflowInstanceRepository.save(instance);
    await this.handlerRepository.save(handler);
    return await this.gotoNextStep(command, userInfo);
  }
  async confirm(command: GotoNextStateDto, userInfo: any) {
    const eventType = command.action ? command.action : 'SUBMIT';
    const instance = await this.workflowInstanceRepository.findOne({
      relations: { taskHandler: true },
      where: { id: command.instanceId },
    });
    const handler = { ...instance.taskHandler };
    handler.handlerUser = userInfo;
    handler.handlerUserId = userInfo.userId;
    handler.data = command.data;
    const tracker = new TaskTrackerEntity();
    tracker.data = command.data;
    tracker.instanceId = command.instanceId;
    tracker.pickedAt = handler.pickedAt;
    if (command.action.toLowerCase() === 'yes') {
      tracker.action = 'Yes';
    } else if (command.action.toLowerCase() === 'no') {
      tracker.action = 'No';
    } else {
      throw new BadRequestException('Unknown Command');
    }
    await this.workflowInstanceRepository.save(instance);
    await this.handlerRepository.save(handler);
    await this.trackerRepository.save(tracker);
    return await this.gotoNextStep(command, userInfo);
  }
  async adjustApplication(instanceId: string, userId: string) {
    const instance = await this.workflowInstanceRepository.findOne({
      where: { id: instanceId },
    });
    if (!instance) throw new NotFoundException('WorkflowInstance not found');
    //instance. = userId;

    const result = await this.workflowInstanceRepository.save(instance);
  }

  async completeApplication(instanceId: string, userInfo: any) {
    const instance = await this.workflowInstanceRepository.findOne({
      where: { id: instanceId },
    });
    if (!instance) throw new NotFoundException('WorkflowInstance not found');
    const today = new Date();
    instance.taskHandler = userInfo.userId;
    instance.status = WorkflowInstanceEnum.Completed;
    // instance.approvedAt = today;
    // const exprireYear = today.getFullYear() + 1;
    // instance.expireDate = new Date(
    //   exprireYear,
    //   today.getMonth(),
    //   today.getDate(),
    // );
    await this.workflowInstanceRepository.save(instance);
  }

  async update(
    dto: UpdateWorkflowInstanceDto,
  ): Promise<WorkflowInstanceResponse> {
    const workflowInstance = await this.workflowInstanceRepository.findOne({
      where: { id: dto.id },
    });
    if (!workflowInstance)
      throw new NotFoundException('WorkflowInstance not found');
    workflowInstance.requestorId = dto.requestorId;
    // workflowInstance.bpId = dto.bpId;
    workflowInstance.status = dto.status;
    const result = await this.workflowInstanceRepository.save(workflowInstance);
    return WorkflowInstanceResponse.toResponse(result);
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

  async addTaskTracker(dto: CreateTaskTrackerDto): Promise<void> {
    const tracker = CreateTaskTrackerDto.fromDto(dto);
    const result = await this.trackerRepository.insert(tracker);
    //return TaskTrackerResponse.toResponse(result);
  }

  getStateMetaData(meta) {
    return Object.keys(meta).reduce((acc, key) => {
      const value = meta[key];
      // Assuming each meta value is an object
      Object.assign(acc, value);

      return acc;
    }, {});
  }

  async renewRegistration(
    dto: UpdateWorkflowInstanceDto,
    userInfo: any,
  ): Promise<WorkflowInstanceResponse> {
    const result = await this.workflowInstanceRepository.findOne({
      where: { id: dto.id },
    });
    if (result) {
      const wfDto = new CreateWorkflowInstanceDto();
      //  wfDto.pricingId = result.pricingId;
      wfDto.requestorId = dto.requestorId;
      wfDto.status = WorkflowInstanceEnum.Submitted;
      // wfDto.key = ServiceKeyEnum.renewal;
      const response = await this.create(wfDto, userInfo);
      if (response.application) {
        const dto = new GotoNextStateDto();
        dto.instanceId = response.application.id;
        dto.action = 'ISR';
        await this.gotoNextStep(dto, userInfo);
      }
      return response;
    }
    return null;
  }
  async upgradeRegistration(
    dto: UpdateWorkflowInstanceDto,
    userInfo: any,
  ): Promise<WorkflowInstanceResponse> {
    const preveous = await this.workflowInstanceRepository.findOne({
      relations: {
        businessProcess: { service: true },
        price: true,
      },
      where: { id: dto.id },
    });
    const proposedPrice = await this.pricingRepository.findOne({
      where: { id: dto.pricingId },
    });
    if (preveous.price.valueFrom > proposedPrice.valueFrom) {
      throw new NotFoundException('Only upgrade is allowed');
    }
    const wfmodel = new UpdateWorkflowInstanceDto();
    //  wfmodel.key = ServiceKeyEnum.upgrade;
    wfmodel.requestorId = userInfo.userId;
    // wfmodel.pricingId = dto.pricingId;
    const response = await this.create(wfmodel, userInfo);
    const command = new GotoNextStateDto();
    command.instanceId = response.application.id;
    command.action = 'ISR';
    await this.gotoNextStep(command, userInfo);
    return response;
  }
  async savePayment(
    dto: PaymentReceiptDto,
  ): Promise<PaymentReceiptResponseDto> {
    const entity = PaymentReceiptDto.fromDto(dto);
    console.log(entity, dto);
    const newService = await this.receiptRepository.save(entity);
    return PaymentReceiptResponseDto.toResponse(newService);
  }
  async getInvoice(invoceId: string): Promise<InvoiceResponseDto> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoceId },
    });
    if (invoice) {
      return InvoiceResponseDto.toResponse(invoice);
    }
    return null;
  }
  async sendEmailNotification(dto: CreateTaskHandlerDto) {
    console.log(dto);
  }
  async sendSMSNotification(dto: CreateTaskHandlerDto) {
    console.log(dto);
  }
}

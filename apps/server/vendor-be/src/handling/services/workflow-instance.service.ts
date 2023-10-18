import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not, In } from 'typeorm';
import { DataResponseFormat } from 'src/shared/api-data';
import { CollectionQuery, QueryConstructor } from 'src/shared/collection-query';
import { WorkflowInstanceEntity } from '../entities/workflow-instance';
import { WorkflowInstanceResponse } from '../dtos/workflow-instance.response';
import {
  CreateWorkflowInstanceDto,
  GotoNextStateDto,
  UpdateWorkflowInstanceDto,
} from '../dtos/workflow-instance.dto';
import { CreateTaskHandlerDto } from '../dtos/task-handler.dto';
import { CreateTaskTrackerDto } from '../dtos/task-tracker.dto';
import { BpServiceEntity } from '../../services/entities/bp-service';
import { createMachine, interpret } from 'xstate';
import { TaskHandlerEntity } from '../entities/task-handler';
import { TaskEntity } from '../../bpm/entities/task.entity';
import { TaskTypes } from '../dtos/task-type.enum';
import { StateMetaData } from '../dtos/state-metadata';
import { TaskTrackerEntity } from '../entities/task-tracker';
import { TaskTrackerResponse } from '../dtos/task-tracker.response';
import { TaskResponse } from '../../bpm/dtos/task.response';
import { ServicePriceEntity } from 'src/pricing/entities/service-price.entity';
import {
  BusinessStatusEnum,
  ServiceKeyEnum,
  WorkflowInstanceEnum,
} from '../dtos/workflow-instance.enum';
import { InvoiceEntity } from '../entities/invoice.entity';
import { VendorsEntity } from 'src/vendor-registration/entities/vendors.entity';
import {
  PaymentReceiptDto,
  PaymentReceiptResponseDto,
} from 'src/vendor-registration/dto/payment-receipt.dto';
import { InvoiceResponseDto } from 'src/vendor-registration/dto/invoice.dto';
import { PaymentReceiptEntity } from '../entities/receipt-attachment';
import { VendorsResponseDto } from 'src/vendor-registration/dto/vendor.dto';
import { HandlingCommonService } from './handling-common-services';
@Injectable()
export class WorkflowInstanceService {
  constructor(
    @InjectRepository(WorkflowInstanceEntity)
    private readonly workflowInstanceRepository: Repository<WorkflowInstanceEntity>,
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    @InjectRepository(ServicePriceEntity)
    private readonly pricingRepository: Repository<ServicePriceEntity>,
    @InjectRepository(TaskHandlerEntity)
    private readonly handlerRepository: Repository<TaskHandlerEntity>,
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,
    @InjectRepository(BpServiceEntity)
    private readonly serviceRepository: Repository<BpServiceEntity>,
    @InjectRepository(TaskTrackerEntity)
    private readonly trackerRepository: Repository<TaskTrackerEntity>, //private readonly vendorService: VendorRegistrationsService,
    @InjectRepository(VendorsEntity)
    private readonly vendorRepository: Repository<VendorsEntity>,
    @InjectRepository(PaymentReceiptEntity)
    private readonly receiptRepository: Repository<PaymentReceiptEntity>,
    private readonly commonService: HandlingCommonService,
  ) {}

  async submitFormBasedTask(
    nextCommand: GotoNextStateDto,
    userInfo: any,
  ): Promise<WorkflowInstanceResponse> {
    const response = new WorkflowInstanceResponse();
    return response;
  }
  async getCerteficateInfo(
    vendorId: string,
    query: CollectionQuery,
  ): Promise<VendorsResponseDto> {
    console.log(vendorId);
    const vendor = await this.vendorRepository.findOne({
      relations: {
        instances: { price: true },
      },
      where: {
        // id: vendorId,
        instances: {
          requestorId: vendorId,
          approvedAt: Not(null),
          status: WorkflowInstanceEnum.Completed,
          price: { businessArea: In(['Goods', 'Services']) },
          businessStatus: 'Active',
        },
      },
    });
    if (!vendor) throw new NotFoundException('Not Found');
    const response = VendorsResponseDto.fromEntity(vendor);
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
  async getById(id: string): Promise<WorkflowInstanceResponse> {
    const workflowInstance = await this.workflowInstanceRepository.findOne({
      where: { id: id },
      relations: { taskHandler: { task: true }, businessProcess: true },
    });
    if (!workflowInstance)
      throw new NotFoundException('WorkflowInstance not found');
    return WorkflowInstanceResponse.toResponse(workflowInstance);
  }
  async create(
    dto: CreateWorkflowInstanceDto,
    userInfo: any = {},
  ): Promise<any> {
    const response = {};
    console.log(dto);
    const instanceEntity = CreateWorkflowInstanceDto.fromDto(dto);
    const price = await this.pricingRepository.findOne({
      where: { id: instanceEntity.pricingId },
    });
    const service = await this.serviceRepository.findOne({
      relations: {
        businessProcesses: true,
      },
      where: {
        id: price.serviceId,
        businessProcesses: { isActive: true },
      },
    });
    /*
        const vendorInfo = await this.vendorrepository.findOne({
          relations: {
            shareholders: true,
            vendorAccounts: { bank: true },
            beneficialOwnership: true,
            instances: true,
            customCats: true,
            businessCats: true,
          },
          where: { id: dto.requestorId },
        });
        console.log('vendorInfo', vendorInfo);
    */
    //const prefix = price.businessArea.charAt(0).toUpperCase();
    const bp = service.businessProcesses.find((a) => a.isActive === true);
    instanceEntity.bpId = bp.id;
    instanceEntity.status = WorkflowInstanceEnum.Submitted;
    const wfinstance = await this.saveWorkflowInstance(instanceEntity);
    const machine = createMachine({
      predictableActionArguments: true,
      ...bp.workflow,
    });
    const taskHandler = new TaskHandlerEntity();
    response['application'] = wfinstance;
    const stateMachine = interpret(machine).onTransition(async (state) => {
      const task = await this.taskRepository.findOne({
        where: { bpId: bp.id, name: state.value.toString() },
      });
      taskHandler.currentState = state.value.toString();
      taskHandler.instanceId = instanceEntity.id;
      taskHandler.taskId = task.id;
      taskHandler.previousHandlerId = null;
      taskHandler.handlerName = userInfo.name;
      taskHandler.handlerUserId = userInfo.userId;
      taskHandler.assignmentStatus = 'Unpicked';
      taskHandler.data = { ...dto.data };
      try {
        const insertedTaskHandler =
          await this.handlerRepository.save(taskHandler);
        task.taskHandlers = [insertedTaskHandler];
        response['task'] = task;
      } catch (error) {
        console.log(error);
      }
    });
    stateMachine.start();
    stateMachine.stop();

    return response;
  }
  private async saveWorkflowInstance(instanceEntity: WorkflowInstanceEntity) {
    let wfinstance = new WorkflowInstanceEntity();
    try {
      instanceEntity.applicationNumber =
        await this.commonService.generateApplicationNumber('PPDA', 'GNR');
      wfinstance = await this.workflowInstanceRepository.save(instanceEntity);
    } catch (error) {
      this.saveWorkflowInstance(instanceEntity);
    }
    return wfinstance;
  }

  async generateInvoice(instanceId: string, taskId: string): Promise<boolean> {
    const result = await this.handlerRepository.findOne({
      relations: {
        task: true,
        workflowInstance: {
          businessProcess: {
            service: true,
          },
          price: true,
          vendor: true,
        },
      },
      where: {
        instanceId: instanceId,
        taskId: taskId,
      },
    });
    if (!result) {
      throw new NotFoundException('Not Found');
    }
    const invoice = new InvoiceEntity();
    const service = result.workflowInstance.businessProcess.service;
    //if th service is upgrade
    if (service.key == ServiceKeyEnum.upgrade) {
      const previousPayment = await this.workflowInstanceRepository.findOne({
        relations: {
          businessProcess: {
            service: true,
          },
          price: true,
        },
        where: {
          businessProcess: { service: { key: ServiceKeyEnum.new } },
          status: WorkflowInstanceEnum.Completed,
          approvedAt: Not(IsNull()),
          price: { businessArea: result.workflowInstance.price.businessArea },
          requestorId: result.workflowInstance.requestorId,
        },
      });

      if (previousPayment) {
        if (previousPayment.price.fee < result.workflowInstance.price.fee) {
          //if any additional logic will add here
          const previousFeeRate = previousPayment.price.fee / 365;
          const proposedPaymentRate = result.workflowInstance.price.fee / 365;
          const datesLeftToExpire = this.commonService.ComputeDateDifference(
            new Date(),
            new Date(previousPayment.expireDate),
          );
          const unUtilizedMoney = Number(datesLeftToExpire) * previousFeeRate;
          const expectedFeeForNewLevel =
            proposedPaymentRate * Number(datesLeftToExpire);
          const netPaymnetForUpgrade = expectedFeeForNewLevel - unUtilizedMoney;
          invoice.amount = netPaymnetForUpgrade;
        }
      } else {
        throw new NotFoundException('Something went wrong');
      }
    } else {
      invoice.amount = result.workflowInstance.price.fee;
    }
    invoice.instanceId = result.instanceId;
    invoice.taskName = result.task.name;
    invoice.taskId = result.task.id;
    invoice.payToAccName = 'PPDA';
    invoice.payToAccNo = '123456789';
    invoice.payToBank = 'Malawi Bank';
    invoice.applicationNo = result.workflowInstance.applicationNumber;
    invoice.payerName = result.workflowInstance.vendor.name;
    invoice.payerAccountId = result.workflowInstance.vendor.userId;
    invoice.serviceName = result.workflowInstance.businessProcess.service.name;
    invoice.remark = 'reamrk';
    invoice.paymentStatus = 'Pending';
    invoice.createdOn = new Date();
    const response = this.invoiceRepository.insert(invoice);
    if (response) return true;
    return false;
  }

  async gotoNextStep(
    nextCommand: GotoNextStateDto,
    userInfo: any = {
      userId: '96d95fdb-7852-4ddc-982f-0e94d23d15d3',
      name: 'xx',
    },
  ) {
    const taskInfo = new TaskEntity();
    const workflowInstance = await this.workflowInstanceRepository.findOne({
      where: { id: nextCommand.instanceId },
      relations: { taskHandler: true, businessProcess: true },
    });
    if (!workflowInstance)
      throw new NotFoundException('Workflow Instance not found');
    const currentTaskHandler = workflowInstance.taskHandler;
    const previousTaskId = currentTaskHandler.taskId;
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
          const today = new Date();
          workflowInstance.approvedAt = today;
          const exprirYear = today.getFullYear() + 1;
          workflowInstance.expireDate = new Date(
            exprirYear,
            today.getMonth(),
            today.getDate(),
          );
          await this.addTaskTracker({
            taskId: currentTaskHandler?.taskId,
            instanceId: workflowInstance?.id,
            data: nextCommand?.data,
            action: nextCommand?.action,
            previousHandlerId: currentTaskHandler?.id,
            handlerName: currentTaskHandler.handlerName,
            handlerUserId: currentTaskHandler.handlerUserId,
            pickedAt: currentTaskHandler.pickedAt,
            checkLists: nextCommand.taskChecklist,
          });
          await this.handlerRepository.delete(currentTaskHandler.id);
        } else {
          const task = await this.taskRepository.findOne({
            where: {
              name: state.value.toString(),
              bpId: workflowInstance.bpId,
            },
          });
          if (!task) {
            throw new NotFoundException('not found ');
          }
          stateMetaData['type'] = task.taskType;
          taskInfo.handlerType = task.handlerType;
          taskInfo.taskType = task.taskType;
          this.handleEvent(stateMetaData, nextCommand, task.id)
            .then((res) => {
              console.log('handleEvent success', res);
            })
            .catch((err) => {
              console.log('handleEvent error', err);
            });
          const data = { remark: nextCommand.remark, ...nextCommand.data };
          currentTaskHandler.data = data;
          currentTaskHandler.taskId = task.id;
          this.handlerRepository
            .save(currentTaskHandler)
            .then((response) =>
              this.addTaskTracker({
                taskId: previousTaskId, //task.id,
                instanceId: workflowInstance.id,
                data: nextCommand.data,
                handlerUserId: userInfo.userId,
                action: nextCommand.action,
                previousHandlerId: currentTaskHandler.handlerUserId,
                handlerName: currentTaskHandler.handlerName,
                pickedAt: currentTaskHandler.pickedAt,
                checkLists: nextCommand.taskChecklist,
              }),
            )
            .catch((error) => {
              throw new BadRequestException(error);
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
  async getTaskById(id: string): Promise<TaskEntity> {
    return await this.taskRepository.findOne({ where: { id: id } });
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
        await this.generateInvoice(command.instanceId, taskId);
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
    handler.handlerName = userInfo.name;
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
    handler.handlerName = userInfo.name;
    handler.handlerUserId = userInfo.userId;
    handler.data = command.data;
    const tracker = new TaskTrackerEntity();
    tracker.createdAt = new Date();
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
    instance.approvedAt = today;
    const exprireYear = today.getFullYear() + 1;
    instance.expireDate = new Date(
      exprireYear,
      today.getMonth(),
      today.getDate(),
    );
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
  async addTaskHandler(dto: CreateTaskHandlerDto): Promise<TaskResponse> {
    const workflowInstance = await this.workflowInstanceRepository.findOne({
      where: { id: dto.instanceId },
    });
    if (!workflowInstance)
      throw new NotFoundException('WorkflowInstance not found');
    const handler = CreateTaskHandlerDto.fromDto(dto);
    const result = await this.taskRepository.save(handler);
    return TaskResponse.toResponse(result);
  }
  // async updateTaskHandler(dto: UpdateTaskHandlerDto): Promise<TaskResponse> {
  //   const taskHandler = await this.taskRepository.findOne({
  //     where: { id: dto.id },
  //   });
  //   if (!taskHandler) throw new NotFoundException('Task Handler not found');
  //   const handler = UpdateTaskHandlerDto.fromDto(dto);
  //   const result = await this.taskRepository.save(handler);
  //   return TaskResponse.toResponse(result);
  // }
  async addTaskTracker(
    dto: CreateTaskTrackerDto,
  ): Promise<TaskTrackerResponse> {
    const tracker = CreateTaskTrackerDto.fromDto(dto);
    const result = await this.trackerRepository.save(tracker);
    return TaskTrackerResponse.toResponse(result);
  }
  // async removeTaskTracker(
  //   dto: DeleteTaskTrackerDto,
  // ): Promise<WorkflowInstanceResponse> {
  //   const workflowInstance = await this.workflowInstanceRepository.findOne({
  //     where: { id: dto.instanceId },
  //     relations: ['taskTrackers'],
  //   });
  //   if (!workflowInstance)
  //     throw new NotFoundException('WorkflowInstance not found');
  //   const tracker = workflowInstance.taskTrackers.find((a) => a.id === dto.id);
  //   workflowInstance.removeTracker(tracker);
  //   const result = await this.workflowInstanceRepository.save(workflowInstance);
  //   return WorkflowInstanceResponse.toResponse(result);
  // }
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
      wfDto.pricingId = result.pricingId;
      wfDto.requestorId = userInfo.userId;
      wfDto.status = WorkflowInstanceEnum.Draft;
      wfDto.key = ServiceKeyEnum.renewal;
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
    wfmodel.key = ServiceKeyEnum.upgrade;
    wfmodel.requestorId = userInfo.userId;
    wfmodel.pricingId = dto.pricingId;
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

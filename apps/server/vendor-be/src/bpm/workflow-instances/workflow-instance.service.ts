import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { DataResponseFormat } from 'src/shared/api-data';
import { CollectionQuery, QueryConstructor } from 'src/shared/collection-query';
import { WorkflowInstanceEntity } from './entities/workflow-instance';
import { WorkflowInstanceResponse } from './workflow-instance.response';
import {
  CreateWorkflowInstanceDto,
  GotoNextStateDto,
  UpdateWorkflowInstanceDto,
} from './dtos/workflow-instance.dto';
import {
  CreateTaskHandlerDto,
  UpdateTaskHandlerDto,
} from './dtos/task-handler.dto';
import {
  CreateTaskTrackerDto,
  DeleteTaskTrackerDto,
} from './dtos/task-tracker.dto';
import { BpServiceEntity } from '../services/entities/bp-service';
import { createMachine, interpret } from 'xstate';
import { TaskHandlerEntity } from './entities/task-handler';
import { TaskEntity } from '../tasks/entities/task.entity';
import { BusinessProcessEntity } from '../business-process/entities/business-process';
import { TaskTypes } from './task-type.enum';
import { StateMetaData } from './state-metadata';
import { TaskTrackerEntity } from './entities/task-tracker';
import { TaskTrackerResponse } from './task-tracker.response';
import { TaskResponse } from '../tasks/task.response';
import { ServicePriceEntity } from 'src/vendor-registration/entities/service-price.entity';
import { ApplicationExcutionService } from '../application-execution.service';
import { WorkflowInstanceEnum } from '../workflow-instance.enum';
//import { VendorRegistrationsService } from 'src/vendor-registration/vendor-registration.service';
import { TaskType } from '../tasks/entities/taskType';
import { InvoiceEntity } from './entities/invoice.entity';
import { VendorRegistrationsService } from 'src/vendor-registration/vendor-registration.service';

@Injectable()
export class WorkflowInstanceService {
  constructor(
    @InjectRepository(WorkflowInstanceEntity)
    private readonly workflowInstanceRepository: Repository<WorkflowInstanceEntity>,
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    private dataSource: DataSource,
    // @InjectRepository(VendorsEntity)
    // private readonly vendorRepository: Repository<VendorsEntity>,
    @InjectRepository(BusinessProcessEntity)
    private readonly bpRepository: Repository<BusinessProcessEntity>,
    private readonly appService: ApplicationExcutionService,
    @Inject(VendorRegistrationsService)
    private readonly vendorService: VendorRegistrationsService,
  ) {}
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
      relations: ['taskHandler', 'taskHandler.task', 'businessProcess'],
    });
    if (!workflowInstance)
      throw new NotFoundException('WorkflowInstance not found');
    return WorkflowInstanceResponse.toResponse(workflowInstance);
  }
  async create(dto: CreateWorkflowInstanceDto): Promise<any> {
    const response = {};

    const workflowInstanceEntity = CreateWorkflowInstanceDto.fromDto(dto);
    const price = await this.dataSource
      .getRepository(ServicePriceEntity)
      .findOne({ where: { id: dto.pricingId } });

    const service = await this.dataSource
      .getRepository(BpServiceEntity)
      .createQueryBuilder('services')
      .leftJoinAndSelect('services.businessProcesses', 'businessProcesses')
      .where('services.id=:id', { id: price.serviceId })
      .andWhere('businessProcesses.isActive=:isActive', { isActive: true })
      .getOne();

    const bp = service.businessProcesses.find((a) => a.isActive === true);
    workflowInstanceEntity.bpId = bp.id;
    workflowInstanceEntity.applicationNumber = Date.now().toString();
    workflowInstanceEntity.status = WorkflowInstanceEnum.Submitted;
    const newWorkflowInstance = await this.workflowInstanceRepository.save(
      workflowInstanceEntity,
    );

    const machine = createMachine({
      predictableActionArguments: true,
      ...bp.workflow,
    });
    const taskHandler = new TaskHandlerEntity();
    response['service'] = service;
    response['application'] = newWorkflowInstance;
    const stateMachine = interpret(machine).onTransition(async (state) => {
      const task = await this.dataSource
        .getRepository(TaskEntity)
        .createQueryBuilder('tasks')
        .where('tasks.name=:taskName', { taskName: state.value.toString() })
        .andWhere('tasks.businessProcessId=:businessProcessId', {
          businessProcessId: bp.id,
        })
        .getOne();
      const vendor = await this.vendorService.getVendorById(
        newWorkflowInstance.requestorId,
      );
      // const vendor = dto.data;
      taskHandler.currentState = state.value.toString();
      taskHandler.instanceId = newWorkflowInstance.id;
      taskHandler.taskId = task.id;
      taskHandler.previousHandlerId = null;
      taskHandler.assignmentStatus = 'Unassigned';
      taskHandler.data = vendor;
      const insertedTaskHandler = await this.dataSource
        .getRepository(TaskHandlerEntity)
        .save(taskHandler);
      task.taskHandlers = [insertedTaskHandler];
      response['task'] = task;
    });

    // Start the stateMachine
    stateMachine.start();
    if (service.key.toLowerCase() == 'newregistration')
      stateMachine.send('ISR');
    // Stop the stateMachine when you are no longer using it.
    stateMachine.stop();
    return response;
  }
  async gotoNextStep(nextCommand: GotoNextStateDto) {
    const workflowInstance = await this.workflowInstanceRepository.findOne({
      where: { id: nextCommand.instanceId },
      relations: ['taskHandler', 'businessProcess'],
    });

    if (!workflowInstance)
      throw new NotFoundException('Workflow Instance not found');
    const currentTaskHandler = workflowInstance.taskHandler;
    const bp = await this.bpRepository.findOne({
      where: { id: workflowInstance.bpId },
    });
    const bpWorkflow = Object.assign({}, bp.workflow);
    bpWorkflow['initial'] = currentTaskHandler.currentState;
    const machine = createMachine({
      predictableActionArguments: true,
      ...bpWorkflow,
    });

    const stateMachine = interpret(machine).onTransition(async (state) => {
      if (state.value !== currentTaskHandler.currentState) {
        workflowInstance.status = WorkflowInstanceEnum.Inprogress;
        if (state.done) {
          workflowInstance.status = WorkflowInstanceEnum.Completed;
        }

        currentTaskHandler.currentState = state.value.toString();
        const stateMetaData = this.getStateMetaData(state.meta);
        const task = await this.taskRepository.findOne({
          where: {
            name: state.value.toString(),
            businessProcessId: workflowInstance.bpId,
          },
        });
        stateMetaData['type'] = task.taskType;

        this.handleEvent(stateMetaData, nextCommand)
          .then((res) => {
            console.log('handleEvent success', res);
          })
          .catch((err) => {
            console.log('handleEvent error', err);
          });

        const data = { remark: nextCommand.remark, ...nextCommand.data };
        currentTaskHandler.data = data;
        currentTaskHandler.taskId = task.id;
        this.dataSource
          .getRepository(TaskHandlerEntity)
          .save(currentTaskHandler)
          .then((response) => {
            this.addTaskTracker({
              taskId: task.id,
              instanceId: workflowInstance.id,
              data: nextCommand.data,
              handledById: nextCommand.handlerId,
              action: nextCommand.action,
              previousHandlerId: currentTaskHandler.id,
            });
          })
          .catch((error) => {
            throw new BadRequestException(error);
          });
      }
    });
    // Start the service
    stateMachine.start();
    stateMachine.send(nextCommand.action);
    // Stop the service when you are no longer using it.
    stateMachine.stop();

    const result = await this.workflowInstanceRepository.save(workflowInstance);
    return WorkflowInstanceResponse.toResponse(result);
  }

  async handleEvent(stateMetadata: StateMetaData, command: GotoNextStateDto) {
    const eventType = command.action ? command.action : 'SUBMIT';
    console.log('eventType', eventType);
    switch (stateMetadata.type.toLocaleLowerCase()) {
      case TaskTypes.APPROVAL:
        console.log(TaskTypes.APPROVAL, command);
        break;
      case TaskTypes.CONFIRMATION:
        return this.confirm(command);
        break;
      case TaskTypes.REVIEW:
        return this.approve(command);
        break;
      case TaskTypes.INVOICE:
        const taskId = '';
        this.appService.generateInvoice(taskId, command.instanceId);
        /////

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
        const data = await this.dataSource
          .getRepository(InvoiceEntity)
          .find({ where: { instanceId: command.instanceId } });
        data.map((row) => {
          row.paymentStatus = 'Paid';
          return this.dataSource
            .getRepository(InvoiceEntity)
            .update(row.id, row);
        });

        break;
    }
  }

  async approve(command: GotoNextStateDto) {
    const eventType = command.action ? command.action : 'SUBMIT';
    if (eventType.toLocaleLowerCase() === 'adjust') {
    } else if (eventType.toLocaleLowerCase() === 'approve') {
    } else {
    }
  }
  async confirm(command: GotoNextStateDto) {
    const eventType = command.action ? command.action : 'SUBMIT';

    if (eventType.toLocaleLowerCase() == 'no') {
    } else {
    }
  }
  async adjustApplication(instanceId: string, userId: string) {
    const instance = await this.workflowInstanceRepository.findOne({
      where: { id: instanceId },
    });
    if (!instance) throw new NotFoundException('WorkflowInstance not found');
    instance.createdBy = userId;
    instance.status = WorkflowInstanceEnum.Draft;
    const result = await this.workflowInstanceRepository.save(instance);
  }
  async completeApplication(instanceId: string, userId: string) {
    const instance = await this.workflowInstanceRepository.findOne({
      where: { id: instanceId },
    });
    if (!instance) throw new NotFoundException('WorkflowInstance not found');
    const today = new Date();
    instance.createdBy = userId;
    instance.status = WorkflowInstanceEnum.Completed;
    instance.approved_at = today.toDateString();
    const exprireDate = today.setFullYear(today.getFullYear() + 1);
    instance.expire_date = exprireDate.toString();
    const result = await this.workflowInstanceRepository.save(instance);
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
  async updateTaskHandler(dto: UpdateTaskHandlerDto): Promise<TaskResponse> {
    const taskHandler = await this.taskRepository.findOne({
      where: { id: dto.id },
    });
    if (!taskHandler) throw new NotFoundException('Task Handler not found');
    const handler = UpdateTaskHandlerDto.fromDto(dto);
    const result = await this.taskRepository.save(handler);
    return TaskResponse.toResponse(result);
  }
  async addTaskTracker(
    dto: CreateTaskTrackerDto,
  ): Promise<TaskTrackerResponse> {
    // const workflowInstance = await this.workflowInstanceRepository.findOne({
    //   where: { id: dto.instanceId },
    //   relations: ['taskTrackers'],
    // });
    // if (!workflowInstance)
    //   throw new NotFoundException('WorkflowInstance not found');
    const tracker = CreateTaskTrackerDto.fromDto(dto);
    // workflowInstance.addTracker(tracker);
    const result = await this.dataSource
      .getRepository(TaskTrackerEntity)
      .save(tracker);
    return TaskTrackerResponse.toResponse(result);
  }
  async removeTaskTracker(
    dto: DeleteTaskTrackerDto,
  ): Promise<WorkflowInstanceResponse> {
    const workflowInstance = await this.workflowInstanceRepository.findOne({
      where: { id: dto.instanceId },
      relations: ['taskTrackers'],
    });
    if (!workflowInstance)
      throw new NotFoundException('WorkflowInstance not found');
    const tracker = workflowInstance.taskTrackers.find((a) => a.id === dto.id);
    workflowInstance.removeTracker(tracker);
    const result = await this.workflowInstanceRepository.save(workflowInstance);
    return WorkflowInstanceResponse.toResponse(result);
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

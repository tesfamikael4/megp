import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Not, Repository, createQueryBuilder } from 'typeorm';
import { DataResponseFormat } from 'src/shared/api-data';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
} from 'src/shared/collection-query';
import { TaskTrackerResponse } from './workflow-instances/task-tracker.response';
import { TaskTrackerEntity } from './workflow-instances/entities/task-tracker';
import { TaskHandlerResponse } from './workflow-instances/task-handler.response';
import { TaskHandlerEntity } from './workflow-instances/entities/task-handler';
import {
  PaymentReceiptDto,
  PaymentReceiptResponseDto,
} from 'src/vendor-registration/dto/payment-receipt.dto';
import { InvoiceResponseDto } from 'src/vendor-registration/dto/invoice.dto';
import { InvoiceEntity } from 'src/bpm/workflow-instances/entities/invoice.entity';
import { PaymentReceiptEntity } from 'src/bpm/workflow-instances/entities/receipt-attachment';
import { WorkflowInstanceEntity } from './workflow-instances/entities/workflow-instance';
import { log } from 'console';
import { WorkflowInstanceResponse } from './workflow-instances/workflow-instance.response';
import { throwIfEmpty } from 'rxjs';
import { IsNotIn } from 'class-validator';
import { WorkflowInstanceEnum } from './workflow-instance.enum';
@Injectable()
export class ApplicationExcutionService {
  constructor(
    @InjectRepository(InvoiceEntity)
    private readonly invoceRepository: Repository<InvoiceEntity>,
    @InjectRepository(PaymentReceiptEntity)
    private readonly receiptRepository: Repository<PaymentReceiptEntity>,
    @InjectRepository(TaskTrackerEntity)
    private readonly taskTrackingRepository: Repository<TaskTrackerEntity>,
    @InjectRepository(TaskHandlerEntity)
    private readonly taskhandlergRepository: Repository<TaskHandlerEntity>,
    @InjectRepository(WorkflowInstanceEntity)
    private readonly wiRepository: Repository<WorkflowInstanceEntity>,
  ) {}

  async getCompletedTasks(instanceId: string): Promise<TaskTrackerResponse[]> {
    const ctasks = await this.taskTrackingRepository.find({
      where: { instanceId: instanceId },
      relations: ['tasks', 'workflow_instances'],
    });
    //const result= TaskTrackerResponse[]
    const result = ctasks.map((entity) =>
      TaskTrackerResponse.toResponse(entity),
    );
    return result;
  }

  async getCurrunTasks(
    //    servicekey: string,
    query: CollectionQuery,
  ): Promise<DataResponseFormat<WorkflowInstanceResponse>> {
    const dataQuery = QueryConstructor.constructQuery<WorkflowInstanceEntity>(
      this.wiRepository,
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

  /*
        async getCurruntTaskByService(serviceKey: string): Promise<any[]> {
            const result = this.taskhandlergrepository.find({
                relations: {
                    task: true,
                    workflowInstance: {
                        businessProcess: {
                            service: true,
                        },
                    },
                },
                where: {
                    workflowInstance: {
                        status: 'Completed',
                        businessProcess: {
                            service: { key: serviceKey },
                        },
                    },
                },
            });
            console.log(result);
    
            return [];
        }
        */

  async getCurruntTaskByService(
    serviceKey: string,
    query: CollectionQuery,
  ): Promise<DataResponseFormat<WorkflowInstanceResponse>> {
    /*
    const data = await this.wiRepository.find({
      relations: {
        vendor: true,
        businessProcess: {
          service: true,
        },
        taskHandler: {
          task: true,
        },
      },
      where: {
        status: In([WorkflowInstanceEnum.Submitted, WorkflowInstanceEnum.Inprogress]),
        businessProcess: {
          service: { key: serviceKey },
        },
      },
    });
*/
    const [result, total] = await this.wiRepository
      .createQueryBuilder('wf')
      .innerJoin('wf.vendor', 'v')
      .innerJoinAndSelect('wf.businessProcess', 'bp')
      .innerJoinAndSelect('bp.service', 'service')
      .leftJoinAndSelect('wf.taskHandler', 'taskHandler')
      .innerJoinAndSelect('taskHandler.task', 'task')
      .where('service.key=:serviceKey', { serviceKey: serviceKey })
      .skip(query.skip | 0)
      .take(query.top | 20)
      .getManyAndCount();
    const response = new DataResponseFormat<WorkflowInstanceResponse>();
    response.items = result.map((row) =>
      WorkflowInstanceResponse.toResponse(row),
    );
    response.total = response.total = total;
    return response;
  }

  async getCurruntTaskDetail(
    instanceId: string,
  ): Promise<WorkflowInstanceResponse> {
    const instance = await this.wiRepository.findOne({
      relations: {
        vendor: true,
        businessProcess: {
          service: true,
        },
        taskHandler: {
          task: true,
        },
        taskTrackers: {
          task: true,
        },
      },
      where: {
        //status: In([WorkflowInstanceEnum.Submitted, WorkflowInstanceEnum.Inprogress,]),
        id: instanceId,
      },
    });
    if (!instance) {
      throw new NotFoundException('Not Found');
    }
    const response = WorkflowInstanceResponse.toResponse(instance);
    return response;
  }

  async generateInvoice(taskId: string, instanceId: string): Promise<boolean> {
    const result = await this.taskhandlergRepository.findOne({
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
      },
    });
    if (!result) {
      throw new NotFoundException('Not Found');
    }
    const invoice = new InvoiceEntity();
    invoice.instanceId = result.instanceId;
    invoice.taskName = result.task.name;
    invoice.taskId = result.task.id;
    invoice.payToAccName = 'PPDA';
    invoice.payToAccNo = '123456789';
    invoice.payToBank = 'Malawi Bank';
    invoice.applicationNo = result.workflowInstance.applicationNumber;
    invoice.amount = result.workflowInstance.price.fee;
    invoice.payerAccountId = 'payerId1231234';
    invoice.payerName = result.workflowInstance.vendor.name;
    invoice.payerAccountId = result.workflowInstance.vendor.userId;
    invoice.serviceName = result.workflowInstance.businessProcess.service.name;
    invoice.remark = 'reamrk';
    invoice.paymentStatus = 'Pending';
    invoice.createdOn = new Date();
    const response = this.invoceRepository.insert(invoice);
    if (response) return true;
    return false;
  }
  async getInvoices(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<InvoiceResponseDto>> {
    const dataQuery = QueryConstructor.constructQuery<InvoiceEntity>(
      this.invoceRepository,
      query,
    );
    const response = new DataResponseFormat<InvoiceResponseDto>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result.map((entity) =>
        InvoiceResponseDto.toResponse(entity),
      );
    }
    return response;
  }

  async getInvoice(invoceId: string): Promise<InvoiceResponseDto> {
    const invoice = await this.invoceRepository.findOne({
      where: { id: invoceId },
    });
    if (invoice) {
      return InvoiceResponseDto.toResponse(invoice);
    }
    return null;
  }
  async getMyInvoices(
    userId: string,
    query: CollectionQuery,
  ): Promise<DataResponseFormat<InvoiceResponseDto>> {
    query.filter.push([
      {
        field: 'payer_account_id',
        value: userId,
        operator: FilterOperators.EqualTo,
      },
    ]);
    const dataQuery = QueryConstructor.constructQuery<InvoiceEntity>(
      this.invoceRepository,
      query,
    );
    const response = new DataResponseFormat<InvoiceResponseDto>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result.map((entity) =>
        InvoiceResponseDto.toResponse(entity),
      );
    }
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
}

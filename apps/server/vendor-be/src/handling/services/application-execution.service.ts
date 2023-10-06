import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Repository,
  createQueryBuilder,
} from 'typeorm';
import { DataResponseFormat } from 'src/shared/api-data';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
} from 'src/shared/collection-query';
import { TaskTrackerResponse } from '../dtos/task-tracker.response';
import { TaskTrackerEntity } from '../entities/task-tracker';
import { TaskHandlerResponse } from '../dtos/task-handler.response';
import { TaskHandlerEntity } from '../entities/task-handler';
import {
  PaymentReceiptDto,
  PaymentReceiptResponseDto,
} from 'src/vendor-registration/dto/payment-receipt.dto';
import { InvoiceResponseDto } from 'src/vendor-registration/dto/invoice.dto';
import { InvoiceEntity } from 'src/handling/entities/invoice.entity';
import { PaymentReceiptEntity } from 'src/handling/entities/receipt-attachment';
import { WorkflowInstanceEntity } from '../entities/workflow-instance';
import { log } from 'console';
import { WorkflowInstanceResponse } from '../dtos/workflow-instance.response';
import { throwIfEmpty } from 'rxjs';
import { IsNotIn } from 'class-validator';
import {
  BusinessStatusEnum,
  ServiceKeyEnum,
  WorkflowInstanceEnum,
} from '../dtos/workflow-instance.enum';
import { VendorsResponseDto } from 'src/vendor-registration/dto/vendor.dto';
import { FilesEntity } from 'src/vendor-registration/entities/file.entity';
import { FileResponseDto } from 'src/vendor-registration/dto/file.dto';
import { TaskType } from '../../bpm/entities/taskType';
import { TaskTypes } from '../dtos/task-type.enum';
import { ActiveVendorsResponse } from '../dtos/active-vendor-response';
import {
  CreateTaskHandlerDto,
  UpdateTaskHandlerDto,
} from '../dtos/task-handler.dto';
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
    private readonly dataSource: DataSource,
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
    const [result, total] =
      /*await this.wiRepository
      .createQueryBuilder('wf')
      .leftJoinAndSelect('wf.vendor', 'v')
      .innerJoinAndSelect('wf.taskHandler', 'taskHandler')
      .innerJoinAndSelect('taskHandler.task', 'task')
      .innerJoinAndSelect('wf.businessProcess', 'bp')
      .leftJoinAndSelect('bp.service', 'service')
      .where('service.key=:serviceKey', { serviceKey: serviceKey })
      // .addOrderBy("wf.'bp_id'", "ASC")
      .skip(query.skip | 0)
      .take(query.top | 20)
      .getManyAndCount();
*/
      await this.wiRepository.findAndCount({
        relations: {
          vendor: true,
          taskHandler: { task: true },
          businessProcess: {
            service: true,
          },
        },
        where: {
          businessProcess: {
            service: { key: serviceKey },
          },
          taskHandler: { id: Not(IsNull()) },
        },
        order: { createdAt: 'ASC' },
        skip: query.skip | 0,
        take: query.top | 20,
      });

    // .leftJoinAndSelect('wf.vendor', 'v')
    // .innerJoinAndSelect('wf.taskHandler', 'taskHandler')
    // .innerJoinAndSelect('taskHandler.task', 'task')
    // .innerJoinAndSelect('wf.businessProcess', 'bp')
    // .leftJoinAndSelect('bp.service', 'service')
    // .where('service.key=:serviceKey', { serviceKey: serviceKey })
    // .addOrderBy("wf.'bp_id'", "ASC")
    // .skip(query.skip | 0)
    // .take(query.top | 20)
    // .getMany();
    // console.log(x)

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
        vendor: {
          businessCats: {
            category: true,
          },
          customCats: true,
        },
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

    const files = await this.dataSource
      .getRepository(FilesEntity)
      .find({ where: { vendorId: instance.requestorId } });
    const filesResponse = files.map((item) => {
      return FileResponseDto.toResponseDto(item);
    });
    const response = WorkflowInstanceResponse.toResponse(instance);
    response['attachments'] = filesResponse;
    if (
      response.task.taskType.toLowerCase() == TaskTypes.INVOICE.toLowerCase()
    ) {
      response.taskHandler['invoice'] = await this.getInvoiceByInstanceId(
        instanceId,
        response.taskHandler.taskId,
      );
    }
    for (let i = 0; i < response.taskTrackers.length; i++) {
      if (
        response.taskTrackers[i].task.taskType.toLowerCase() ==
        TaskTypes.INVOICE.toLowerCase()
      ) {
        response.taskTrackers[i]['invoice'] = await this.getInvoiceByInstanceId(
          instanceId,
          response.taskTrackers[i].taskId,
        );
      }
    }

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
    const service = result.workflowInstance.businessProcess.service;
    if (service.key == ServiceKeyEnum.upgrade) {
      const previousPayment = await this.wiRepository.findOne({
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
        },
      });
      if (previousPayment) {
        if (previousPayment.price.fee < result.workflowInstance.price.fee)
          //if any additional logic will add here
          invoice.amount =
            result.workflowInstance.price.fee - previousPayment.price.fee;
      } else {
        throw new NotFoundException('Something wend wrong');
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

    //invoice.payerAccountId = 'payerId1231234';
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

  async getInvoiceByInstanceId(
    instanceId: string,
    taskId: string,
  ): Promise<InvoiceResponseDto> {
    const invoice = await this.invoceRepository.findOne({
      where: { instanceId: instanceId, taskId: taskId },
    });
    console.log('invoice', invoice);
    if (invoice) {
      const invoicedto = InvoiceResponseDto.toResponse(invoice);
      return invoicedto;
    }

    return null;
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

  async activeVendors(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<ActiveVendorsResponse>> {
    const today = new Date();
    const [result, total] = await this.wiRepository.findAndCount({
      relations: {
        vendor: true,
        price: true,
      },
      where: {
        status: WorkflowInstanceEnum.Completed,
        businessStatus: BusinessStatusEnum.active,
        expireDate: MoreThan(today.toISOString()),
      },
      skip: query.skip | 0,
      take: query.top | 20,
    });
    const response = new DataResponseFormat<ActiveVendorsResponse>();
    response.items = result.map((item) =>
      ActiveVendorsResponse.toResponse(item),
    );
    response.total = total;

    return response;
  }

  async activeMyBusinessStreams(
    userId: string,
    query: CollectionQuery,
  ): Promise<ActiveVendorsResponse[]> {
    const today = new Date();
    const result = await this.wiRepository.find({
      relations: {
        vendor: true,
        price: true,
      },
      where: {
        status: WorkflowInstanceEnum.Completed,
        businessStatus: BusinessStatusEnum.active,
        // expireDate: MoreThan(today.toISOString()),
        vendor: { userId: userId },
      },
    });
    const response = result.map((item) =>
      ActiveVendorsResponse.toResponse(item),
    );
    return response;
  }

  async pickTask(dto: UpdateTaskHandlerDto) {
    // await this.wiRepository.
  }
  async ConfirmTask(dto: CreateTaskHandlerDto) {
    console.log(dto);
  }
  async ApproveTask(dto: CreateTaskHandlerDto) {
    console.log(dto);
  }
  async ConfirmPayment(dto: CreateTaskHandlerDto) {
    console.log(dto);
  }

  async generateCerteficate(dto: CreateTaskHandlerDto) {
    console.log(dto);
  }
  async sendEmailNotification(dto: CreateTaskHandlerDto) {
    console.log(dto);
  }
  async sendSMSNotification(dto: CreateTaskHandlerDto) {
    console.log(dto);
  }
}

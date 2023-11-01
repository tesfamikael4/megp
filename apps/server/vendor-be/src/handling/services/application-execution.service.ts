import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, IsNull, MoreThan, Not, Repository } from 'typeorm';
import { DataResponseFormat } from 'src/shared/api-data';
import { CollectionQuery, QueryConstructor } from 'src/shared/collection-query';
import { TaskTrackerResponse } from '../dtos/task-tracker.response';
import { TaskTrackerEntity } from '../entities/task-tracker';
import { TaskHandlerEntity } from '../entities/task-handler';
import { InvoiceResponseDto } from 'src/vendor-registration/dto/invoice.dto';
import { InvoiceEntity } from 'src/handling/entities/invoice.entity';
import { WorkflowInstanceEntity } from '../entities/workflow-instance';
import { WorkflowInstanceResponse } from '../dtos/workflow-instance.response';
import {
  AssignmentEnum,
  BusinessStatusEnum,
  ServiceKeyEnum,
  WorkflowInstanceEnum,
} from '../dtos/workflow-instance.enum';
import { FilesEntity } from 'src/vendor-registration/entities/file.entity';
import { FileResponseDto } from 'src/vendor-registration/dto/file.dto';
import { TaskTypes } from '../dtos/task-type.enum';
import { ActiveVendorsResponse } from '../dtos/active-vendor-response';
import {
  UpdateTaskHandlerDto,
} from '../dtos/task-handler.dto';

import puppeteer from 'puppeteer';
@Injectable()
export class ApplicationExcutionService {
  constructor(
    @InjectRepository(InvoiceEntity)
    private readonly invoceRepository: Repository<InvoiceEntity>,
    @InjectRepository(TaskTrackerEntity)
    private readonly taskTrackingRepository: Repository<TaskTrackerEntity>,
    @InjectRepository(TaskHandlerEntity)
    private readonly taskhandlergRepository: Repository<TaskHandlerEntity>,
    @InjectRepository(WorkflowInstanceEntity)
    private readonly wiRepository: Repository<WorkflowInstanceEntity>,
    private readonly dataSource: DataSource,
  ) { }

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

  async getCurruntTaskByService(
    serviceKey: string,
    query: CollectionQuery,
  ): Promise<DataResponseFormat<WorkflowInstanceResponse>> {

    let keys = [];
    if (serviceKey === ServiceKeyEnum.new) {
      keys = [ServiceKeyEnum.goodsNewRegistration, ServiceKeyEnum.servicesNewRegistration, ServiceKeyEnum.worksNewRegistration];
    } else if (serviceKey == ServiceKeyEnum.upgrade) {
      keys = [ServiceKeyEnum.goodsUpgrade, ServiceKeyEnum.servicesUpgrade, ServiceKeyEnum.worksUpgrade];
    } else if (serviceKey === ServiceKeyEnum.renewal) {
      keys = [ServiceKeyEnum.goodsRenewal, ServiceKeyEnum.servicesRenewal, ServiceKeyEnum.worksRenewal]
    }
    const [result, total] = await this.wiRepository.findAndCount({
      relations: {
        vendor: true,
        taskHandler: { task: true },
        businessProcess: {
          service: true,
        },
      },
      where: {
        businessProcess: {
          service: { key: In(keys) },
        },
        taskHandler: { id: Not(IsNull()) },
      },
      order: { submittedAt: 'ASC' },
      skip: query.skip | 0,
      take: query.top | 20,
    });

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
      order: {
        taskTrackers: { createdAt: 'DESC' }
      }
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
  ): Promise<DataResponseFormat<InvoiceResponseDto>> {
    const response = new DataResponseFormat<InvoiceResponseDto>();
    const [result, total] = await this.invoceRepository.findAndCount({
      where: { payerAccountId: userId, paymentStatus: 'Pending' },
    });
    response.total = total;
    response.items = result.map((entity) =>
      InvoiceResponseDto.toResponse(entity),
    );
    return response;
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
        expireDate: MoreThan(today),
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

  async getMyBusinessArea(
    userId: string
  ): Promise<ActiveVendorsResponse[]> {
    const result = await this.wiRepository.find({
      relations: {
        vendor: true,
        price: true,
      },
      where: {
        status: WorkflowInstanceEnum.Completed,
        // businessStatus: BusinessStatusEnum.active,
        // expireDate: MoreThan(today),
        vendor: { userId: userId, status: 'Approved' },

      },
    });
    const response = result.map((item) =>
      ActiveVendorsResponse.toResponse(item),
    );
    return response;
  }

  async pickTask(
    dto: UpdateTaskHandlerDto,
    user: any,
  ): Promise<WorkflowInstanceResponse> {
    const wfInstance = await this.wiRepository.findOne({
      relations: {
        taskHandler: true,
      },
      where: { taskHandler: { taskId: dto.taskId }, id: dto.instanceId },
    });
    if (!wfInstance.taskHandler) {
      throw new BadRequestException();
    }
    wfInstance.taskHandler.assignmentStatus = AssignmentEnum.Picked;
    wfInstance.taskHandler.handlerUserId = user.userId; //
    wfInstance.taskHandler.handlerName = user.name;
    wfInstance.taskHandler.pickedAt = new Date();
    const result = await this.wiRepository.save(wfInstance);
    if (result) return WorkflowInstanceResponse.toResponse(result);
    return null;
  }
  async unpickTask(dto: UpdateTaskHandlerDto) {
    const wfInstance = await this.wiRepository.findOne({
      relations: { taskHandler: true },
      where: { taskHandler: { taskId: dto.taskId }, id: dto.instanceId },
    });
    if (!wfInstance.taskHandler) {
      throw new BadRequestException();
    }
    wfInstance.taskHandler.assignmentStatus = AssignmentEnum.Unpicked;
    wfInstance.taskHandler.handlerUserId = null; //
    wfInstance.taskHandler.handlerName = null;
    wfInstance.taskHandler.pickedAt = null;
    return await this.wiRepository.save(wfInstance);
  }

  async generateCerteficatePdf(
    templateUrl: string,
    selector: string,
  ): Promise<Buffer> {
    const browser = await puppeteer.launch({});
    const page = await browser.newPage();
    await page.goto(templateUrl);
    await page.waitForSelector(selector);
    const buffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        left: '0px',
        top: '0px',
        right: '0px',
        bottom: '0px',
      },
    });
    await browser.close();
    return buffer;
  }
}

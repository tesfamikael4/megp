import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, Not, Repository } from 'typeorm';
import { DataResponseFormat } from 'src/shared/api-data';
import { CollectionQuery, QueryConstructor } from 'src/shared/collection-query';
import { FileResponseDto } from 'src/modules/vendor-registration/dto/file.dto';
import { WorkflowInstanceEntity } from 'src/entities/workflow-instance.entity';

import { TaskTypes } from 'src/modules/bpm/dto/task-type.enum';
import { UpdateTaskHandlerDto } from 'src/modules/bpm/dto/task-handler.dto';
import { WorkflowInstanceResponse } from '../dto/workflow-instance.dto';
import { FilesEntity } from 'src/entities';
import { InvoiceService } from 'src/modules/vendor-registration/services/invoice.service';
import { HandlingCommonService } from './handling-common-services';
import { AssignmentEnum } from '../enums/assignment.enum';
import { HandlerTypeEnum } from '../enums/handler-type.enum';
import { ApplicationStatus } from '../enums/application-status.enum';
@Injectable()
export class ApplicationExcutionService {
  constructor(
    @InjectRepository(WorkflowInstanceEntity)
    private readonly wiRepository: Repository<WorkflowInstanceEntity>,
    private readonly dataSource: DataSource,
    private readonly invoiceService: InvoiceService,
    private readonly commonService: HandlingCommonService
  ) { }

  async getCurruntTaskByServiceKey(serviceKey: string,
    query: CollectionQuery, user: any
  ): Promise<DataResponseFormat<WorkflowInstanceResponse>> {
    const keys = this.commonService.getServiceCatagoryKeys(serviceKey);
    console.log(keys)
    if (keys.length < 0)
      throw new HttpException('Invalid Request', 400);
    const dataQuery = QueryConstructor.constructQuery<WorkflowInstanceEntity>(
      this.wiRepository,
      query,
    );
    dataQuery
      .innerJoinAndSelect('workflow_instances.taskHandler', 'handler')
      .innerJoinAndSelect('handler.task', 'task')
      .leftJoinAndSelect('workflow_instances.service', 'service')
      .leftJoinAndSelect('workflow_instances.isrVendor', 'vendor')
      .innerJoinAndSelect('workflow_instances.businessProcess', 'bp')
      .leftJoinAndSelect('workflow_instances.taskTrackers', 'taskTracker')
      .andWhere('service.key In(:...keys)', { keys: keys })
      .andWhere('workflow_instances.status !=:status ', { status: ApplicationStatus.COMPLETED })
      .andWhere('task.handlerType !=:handlerType', { handlerType: HandlerTypeEnum.REQUESTOR })
      .orderBy('workflow_instances.submittedAt', 'ASC');
    const d = new DataResponseFormat<WorkflowInstanceResponse>();
    const [result, total] = await dataQuery.getManyAndCount();
    d.items = result.map((entity) => {
      return WorkflowInstanceResponse.toResponse(entity)
    });
    d.total = total;
    return d;
  }


  async getCurruntTaskDetail(
    instanceId: string,
  ): Promise<WorkflowInstanceResponse> {
    const instance = await this.wiRepository.findOne({
      relations: {
        isrVendor: true,
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
        taskHandler: { id: Not(IsNull()) }
      },
      order: {
        taskTrackers: { executedAt: 'DESC' },
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
      response.taskHandler['invoice'] =
        await this.invoiceService.getInvoiceByInstanceId(
          instanceId,
          response.taskHandler.taskId,
        );
    }
    for (let i = 0; i < response.taskTrackers.length; i++) {
      if (
        response.taskTrackers[i].task.taskType.toLowerCase() ==
        TaskTypes.INVOICE.toLowerCase()
      ) {
        response.taskTrackers[i]['invoice'] =
          await this.invoiceService.getInvoiceByInstanceId(
            instanceId,
            response.taskTrackers[i].taskId,
          );
      }
    }

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
      where: { id: dto.instanceId },
    });
    if (!wfInstance.taskHandler) {
      throw new BadRequestException();
    }
    wfInstance.taskHandler.assignmentStatus = AssignmentEnum.Picked;
    wfInstance.taskHandler.handlerUserId = user.id;
    wfInstance.taskHandler.handlerUser = user;
    wfInstance.taskHandler.pickedAt = new Date();
    const result = await this.wiRepository.save(wfInstance);
    if (result) return WorkflowInstanceResponse.toResponse(result);
    return null;
  }
  async unpickTask(dto: UpdateTaskHandlerDto) {
    const wfInstance = await this.wiRepository.findOne({
      relations: { taskHandler: true },
      where: { id: dto.instanceId },
    });
    if (!wfInstance.taskHandler) {
      throw new BadRequestException();
    }
    wfInstance.taskHandler.assignmentStatus = AssignmentEnum.Unpicked;
    wfInstance.taskHandler.handlerUserId = null; //
    wfInstance.taskHandler.handlerUser = null;
    wfInstance.taskHandler.pickedAt = null;
    return await this.wiRepository.save(wfInstance);
  }



}

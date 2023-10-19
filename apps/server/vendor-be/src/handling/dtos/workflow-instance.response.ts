import { ApiProperty } from '@nestjs/swagger';
import { BusinessProcessResponse } from '../../bpm/dtos/business-process.response';
import { WorkflowInstanceEntity } from '../entities/workflow-instance';
import { TaskHandlerResponse } from './task-handler.response';
import { TaskTrackerResponse } from './task-tracker.response';
import { BpServiceResponse } from '../../services/bp-service.response';
import { VendorsResponseDto } from 'src/vendor-registration/dto/vendor.dto';
import { TaskResponse } from '../../bpm/dtos/task.response';
import { CustomCategoryResponseDto } from 'src/vendor-registration/dto/custom-category.dto';
import { BusinessCategoryResponseDto } from 'src/vendor-registration/dto/business-category.dto';
import { ServicePriceResponseDto } from 'src/pricing/service-price.dto';
import { ServicePrice } from 'src/pricing/entities/service-price';

export class WorkflowInstanceResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  bpId: string;
  @ApiProperty()
  applicationNumber: string;
  @ApiProperty()
  requestorId: string;
  @ApiProperty()
  status: string;
  @ApiProperty()
  businessProcess?: BusinessProcessResponse;
  @ApiProperty()
  submittedAt: Date;

  taskHandler?: TaskHandlerResponse;
  taskTrackers?: TaskTrackerResponse[];
  service: BpServiceResponse;
  vendor: VendorsResponseDto;
  task: TaskResponse;
  pricing: ServicePrice;
  customCats: CustomCategoryResponseDto[];
  commonCats: BusinessCategoryResponseDto[];

  static toResponse(entity: WorkflowInstanceEntity) {
    const response = new WorkflowInstanceResponse();
    response.id = entity.id;
    response.bpId = entity.bpId;
    response.applicationNumber = entity.applicationNumber;
    response.requestorId = entity.requestorId;
    response.status = entity.status;
    response.pricing = entity?.price;
    response.submittedAt = entity.submittedAt;
    if (entity?.businessProcess) {
      response.businessProcess = BusinessProcessResponse.toResponse(
        entity?.businessProcess,
      );
    }

    if (entity?.businessProcess?.service) {
      response.service = BpServiceResponse.toResponse(
        entity?.businessProcess.service,
      );
    }

    if (entity.vendor?.businessCats) {
      response.commonCats = entity.vendor.businessCats.map((item) =>
        BusinessCategoryResponseDto.toResponse(item),
      );
    }
    if (entity.vendor?.customCats) {
    }

    if (entity?.taskHandler) {
      response.taskHandler = TaskHandlerResponse.toResponse(entity.taskHandler);
      response.task = response.taskHandler?.task;
      response.taskHandler.task = null;
    }

    if (entity?.vendor) {
      response.vendor = VendorsResponseDto.fromEntity(entity.vendor);
    }

    if (entity?.taskTrackers) {
      response.taskTrackers = entity?.taskTrackers?.map((handler) =>
        TaskTrackerResponse.toResponse(handler),
      );
    }

    return response;
  }
}

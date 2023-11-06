import { ApiProperty } from '@nestjs/swagger';
import { WorkflowInstanceEntity } from '../entities/workflow-instance';
import { VendorsResponseDto } from 'src/vendor-registration/dto/vendor.dto';
import { TaskResponse } from '../../bpm/dtos/task.dto';
import { ServicePrice } from 'src/pricing/entities/service-price';
import { BusinessProcessResponse } from 'src/bpm/dtos/business-process.dto';
import { BpServiceResponse } from 'src/services/bp-service.dto';
import { TaskHandlerResponse } from 'src/bpm/dtos/task-handler.dto';
import { TaskTrackerResponse } from 'src/bpm/dtos/task-tracker.dto';

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
  pricingId;
  taskHandler?: TaskHandlerResponse;
  taskTrackers?: TaskTrackerResponse[];
  service: BpServiceResponse;
  vendor: VendorsResponseDto;
  task: TaskResponse;
  pricing: ServicePrice;
  //customCats: CustomCategoryResponseDto[];
  //commonCats: BusinessCategoryResponseDto[];

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

    // if (entity.vendor?.businessCats) {
    //   response.commonCats = entity.vendor.businessCats.map((item) =>
    //     BusinessCategoryResponseDto.toResponse(item),
    //   );
    // }
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

import { ApiProperty } from '@nestjs/swagger';
import { BusinessProcessResponse } from '../business-process/business-process.response';
import { WorkflowInstanceEntity } from './entities/workflow-instance';
import { TaskHandlerResponse } from './task-handler.response';
import { TaskTrackerResponse } from './task-tracker.response';

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
  createdBy: string;
  @ApiProperty()
  updatedBy: string;
  @ApiProperty()
  deletedBy: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  deletedAt: Date;
  taskHandler?: TaskHandlerResponse;
  taskTrackers?: TaskTrackerResponse[];
  static toResponse(entity: WorkflowInstanceEntity) {
    const response = new WorkflowInstanceResponse();
    response.id = entity.id;
    response.bpId = entity.bpId;
    response.applicationNumber = entity.applicationNumber;
    response.requestorId = entity.requestorId;
    response.status = entity.status;
    if (entity?.businessProcess) {
      response.businessProcess = BusinessProcessResponse.toResponse(
        entity?.businessProcess,
      );
    }
    if (entity.taskHandler != undefined) {
      response.taskHandler = TaskHandlerResponse.toResponse(entity.taskHandler);
    }
    if (entity?.taskTrackers) {
      response.taskTrackers = entity?.taskTrackers?.map((handler) =>
        TaskTrackerResponse.toResponse(handler),
      );
    }
    response.createdBy = entity.createdBy;
    response.updatedBy = entity.updatedBy;
    response.deletedBy = entity.deletedBy;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;
    response.deletedAt = entity.deletedAt;
    return response;
  }
}

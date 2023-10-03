import { ApiProperty } from '@nestjs/swagger';
import { TaskHandlerEntity } from '../entities/task-handler';
import { TaskResponse } from '../../bpm/dtos/task.response';
import { WorkflowInstanceResponse } from './workflow-instance.response';
import { VendorsResponseDto } from 'src/vendor-registration/dto/vendor.dto';
import { BpServiceResponse } from '../../services/bp-service.response';

export class TaskHandlerResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  taskId: string;
  @ApiProperty()
  instanceId: string;
  @ApiProperty()
  data: object;
  @ApiProperty()
  assignmentStatus: string;
  @ApiProperty()
  previousHandlerId: string;
  @ApiProperty()
  task?: TaskResponse;
  @ApiProperty()
  workflowInstance?: WorkflowInstanceResponse;
  @ApiProperty()
  currentState: string;
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
  @ApiProperty()
  vendor: VendorsResponseDto;
  @ApiProperty()
  service: BpServiceResponse;
  static toResponse(entity: TaskHandlerEntity) {
    const response = new TaskHandlerResponse();
    response.id = entity.id;
    response.taskId = entity.taskId;
    response.instanceId = entity.instanceId;
    response.data = entity.data;
    response.currentState = entity.currentState;
    response.assignmentStatus = entity.assignmentStatus;
    response.previousHandlerId = entity.previousHandlerId;
    if (entity.task) {
      response.task = TaskResponse.toResponse(entity.task);
    }
    if (entity?.workflowInstance != undefined) {
      response.workflowInstance = WorkflowInstanceResponse.toResponse(
        entity?.workflowInstance,
      );
    }

    if (entity?.workflowInstance?.businessProcess?.service) {
      response.service = BpServiceResponse.toResponse(
        entity?.workflowInstance?.businessProcess?.service,
      );
    }

    const instance = entity?.workflowInstance;
    if (instance != undefined) {
      response.vendor = VendorsResponseDto.fromEntity(
        entity?.workflowInstance?.vendor,
      );
    }

    response.createdBy = entity.createdBy;
    response.updatedBy = entity.updatedBy;
    //response.deletedBy = entity.deletedBy;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;
    // response.deletedAt = entity.deletedAt;
    return response;
  }
}

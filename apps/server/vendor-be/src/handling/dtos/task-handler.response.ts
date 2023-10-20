import { ApiProperty } from '@nestjs/swagger';
import { TaskHandlerEntity } from '../entities/task-handler';
import { TaskResponse } from '../../bpm/dtos/task.dto';
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
  handlerUserId: string;
  @ApiProperty()
  handlerName: string;
  @ApiProperty()
  pickedAt: Date;
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
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  vendor: VendorsResponseDto;
  @ApiProperty()
  service: BpServiceResponse;
  @ApiProperty()
  executedAt: Date;
  static toResponse(entity: TaskHandlerEntity) {
    const response = new TaskHandlerResponse();
    response.id = entity.id;
    response.taskId = entity.taskId;
    response.instanceId = entity.instanceId;
    response.handlerName = entity.handlerName;
    response.handlerUserId = entity.handlerUserId;
    response.pickedAt = entity.pickedAt;
    response.data = entity.data;
    response.currentState = entity.currentState;
    response.assignmentStatus = entity.assignmentStatus;
    response.previousHandlerId = entity.previousHandlerId;
    response.executedAt = entity.executedAt;
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

    return response;
  }
}

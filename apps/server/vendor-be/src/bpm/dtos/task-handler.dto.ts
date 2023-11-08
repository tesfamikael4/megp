import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { TaskHandlerEntity } from '../entities/task-handler';
import { TaskCheckListDto } from 'src/bpm/dtos/task-check-list.dto';
import { VendorsResponseDto } from 'src/vendor-registration/dto/vendor.dto';
import { WorkflowInstanceResponse } from '../../handling/dtos/workflow-instance.response';
import { TaskResponse } from 'src/bpm/dtos/task.dto';
import { BpServiceResponse } from 'src/services/bp-service.dto';
export class CreateTaskHandlerDto {
  @ApiProperty()
  @IsNotEmpty()
  taskId: string;
  @ApiProperty()
  previousHandlerId: string;
  @ApiProperty()
  @IsNotEmpty()
  instanceId: string;
  @ApiProperty()
  assignmentStatus: string;
  @ApiProperty()
  data: object;
  @ApiProperty()
  checkLists: TaskCheckListDto[];
  /**
   * Transfer Data from DTO object to Entity object
   *
   */
  static fromDto(dto: CreateTaskHandlerDto): TaskHandlerEntity {
    const entity = new TaskHandlerEntity();
    if (!dto) {
      return null;
    }
    entity.taskId = dto.taskId;
    entity.data = dto.data;
    entity.instanceId = dto.instanceId;
    entity.previousHandlerId = dto.previousHandlerId;
    entity.assignmentStatus = dto.assignmentStatus;
    return entity;
  }

  /**
   * Transfer list of DTO object to Entity  list
   *
   */
  static fromDtos(dto: CreateTaskHandlerDto[]): TaskHandlerEntity[] {
    return dto?.map((d) => CreateTaskHandlerDto.fromDto(d));
  }
}
export class UpdateTaskHandlerDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  taskId: string;
  @ApiProperty()
  @IsNotEmpty()
  instanceId: string;
  @ApiProperty()
  // @IsNotEmpty()
  assignmentStatus: string;
  @ApiProperty()
  // @IsNotEmpty()
  previousHandlerId: string;
  @ApiProperty()
  //@IsString()
  data: object;
  @ApiProperty()
  //@IsNotEmpty()
  action: string;
  @ApiProperty()
  checkLists: TaskCheckListDto[];

  static fromDto(dto: UpdateTaskHandlerDto): TaskHandlerEntity {
    const entity = new TaskHandlerEntity();
    if (!dto) {
      return;
    }
    entity.id = dto.id;
    entity.instanceId = dto.instanceId;
    entity.taskId = dto.taskId;
    entity.data = dto.data;
    entity.previousHandlerId = dto.previousHandlerId;
    entity.assignmentStatus = dto.assignmentStatus;
    entity.previousHandlerId = dto.previousHandlerId;
    return entity;
  }
}
export class TaskHandlerResponse extends UpdateTaskHandlerDto {
  @ApiProperty()
  handlerUserId: string;
  @ApiProperty()
  handlerName: string;
  @ApiProperty()
  pickedAt: Date;

  @ApiProperty()
  task?: TaskResponse;
  @ApiProperty()
  workflowInstance?: WorkflowInstanceResponse;
  @ApiProperty()
  currentState: string;
  @ApiProperty()
  createdAt: Date;
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

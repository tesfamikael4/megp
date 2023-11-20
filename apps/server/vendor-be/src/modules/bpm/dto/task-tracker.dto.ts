import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { TaskCheckListDto } from './task-check-list.dto';
import { TaskTrackerEntity } from 'src/entities/task-tracker.entity';
import { TaskResponse } from './task.dto';
import { WorkflowInstanceResponse } from 'src/modules/handling/dto/workflow-instance.dto';
export class CreateTaskTrackerDto {
  @ApiProperty()
  @IsNotEmpty()
  taskId: string;
  @ApiProperty()
  @IsNotEmpty()
  previousHandlerId: string;
  @ApiProperty()
  @IsNotEmpty()
  instanceId: string;
  @ApiProperty()
  handlerUserId: string;
  @ApiProperty()
  handlerUser: string;
  @ApiProperty()
  pickedAt: Date;
  @ApiProperty()
  @IsString()
  data: object;
  @ApiProperty()
  @IsString()
  action: string;
  @ApiProperty()
  @IsString()
  remark?: string;
  @ApiProperty()
  checkLists: TaskCheckListDto[];
  executedAt: Date;
  /**
   * Transfer Data from DTO object to Entity object
   *
   */
  static fromDto(dto: CreateTaskTrackerDto): TaskTrackerEntity {
    const entity = new TaskTrackerEntity();
    if (!dto) {
      return null;
    }
    entity.taskId = dto.taskId;
    entity.data = dto.data;
    entity.instanceId = dto.instanceId;
    entity.previousHandlerId = dto.previousHandlerId;
    entity.handlerUserId = dto.handlerUserId;
    entity.handlerUser = dto.handlerUser;
    entity.action = dto.action;
    entity.executedAt = dto.executedAt;
    entity.remark = dto.remark;
    entity.pickedAt = dto.pickedAt;
    entity.checklists = dto.checkLists;
    return entity;
  }

  /**
   * Transfer list of DTO object to Entity  list
   *
   */
  static fromDtos(dto: CreateTaskTrackerDto[]): TaskTrackerEntity[] {
    return dto?.map((d) => CreateTaskTrackerDto.fromDto(d));
  }
}
export class UpdateTaskTrackerDto extends CreateTaskTrackerDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  id: string;

  static fromDto(dto: UpdateTaskTrackerDto): TaskTrackerEntity {
    const entity = new TaskTrackerEntity();
    if (!dto) {
      return;
    }
    entity.id = dto.id;
    entity.instanceId = dto.instanceId;
    entity.taskId = dto.taskId;
    entity.data = dto.data;
    entity.action = dto.action;
    entity.previousHandlerId = dto.previousHandlerId;
    entity.handlerUserId = dto.handlerUserId;
    entity.remark = dto.remark;
    entity.executedAt = dto.executedAt;
    entity.pickedAt = dto.pickedAt;
    entity.handlerUser = dto.handlerUser;
    entity.checklists = dto.checkLists;
    return entity;
  }
}

export class TaskTrackerResponse extends UpdateTaskTrackerDto {
  @ApiProperty()
  task?: TaskResponse;
  @ApiProperty()
  workflowInstance?: WorkflowInstanceResponse;
  @ApiProperty()
  taskChecklist: TaskCheckListDto[];
  static toResponse(entity: TaskTrackerEntity) {
    const response = new TaskTrackerResponse();
    response.id = entity.id;
    response.taskId = entity.taskId;
    response.instanceId = entity.instanceId;
    response.handlerUser = entity.handlerUser;
    response.handlerUserId = entity.handlerUserId;
    response.pickedAt = entity.pickedAt;
    response.data = entity.data;
    response.taskChecklist = entity.checklists;
    response.previousHandlerId = entity.previousHandlerId;
    response.executedAt = entity.executedAt;
    response.remark = entity.remark;
    if (entity.task) {
      response.task = TaskResponse.toResponse(entity.task);
    }
    if (entity.workflowInstance) {
      response.workflowInstance = WorkflowInstanceResponse.toResponse(
        entity.workflowInstance,
      );
    }
    response.action = entity.action;
    return response;
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { BusinessProcessResponse } from './business-process.response';
import { TaskAssignmentEntity } from '../entities/task-assignment';
import { TaskResponse } from './task.response';

export class TaskAssignmentResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  taskId: string;
  @ApiProperty()
  assigneeId: string;
  @ApiProperty()
  assigneeName: string;
  @ApiProperty()
  assignmentType: string;
  @ApiProperty()
  task?: TaskResponse;
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
  static toResponse(entity: TaskAssignmentEntity) {
    const response = new TaskAssignmentResponse();
    response.id = entity.id;
    response.taskId = entity.taskId;
    response.assigneeId = entity.assigneeId;
    response.assigneeName = entity.assigneeName;
    response.assignmentType = entity.assignmentType;
    if (entity.task) {
      response.task = TaskResponse.toResponse(entity.task);
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

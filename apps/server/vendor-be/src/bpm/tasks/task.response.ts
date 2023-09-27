import { ApiProperty } from '@nestjs/swagger';
import { BusinessProcessResponse } from '../business-process/business-process.response';
import { TaskEntity } from './entities/task.entity';
import { TaskAssignmentResponse } from './task-assignment.response';

export class TaskResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  businessProcessId: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  handlerType: string;
  @ApiProperty()
  taskType: string;
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
  assignments?: TaskAssignmentResponse[];
  static toResponse(entity: TaskEntity) {
    const response = new TaskResponse();
    response.id = entity.id;
    response.businessProcessId = entity.businessProcessId;
    response.name = entity.name;
    response.description = entity.description;
    response.handlerType = entity.handlerType;
    response.taskType = entity.taskType;
    if (entity.businessProcess) {
      response.businessProcess = BusinessProcessResponse.toResponse(
        entity.businessProcess,
      );
    }
    if (entity.assignments) {
      response.assignments = entity.assignments.map((assignment) =>
        TaskAssignmentResponse.toResponse(assignment),
      );
    }
    // response.createdBy = entity.createdBy;
    //  response.updatedBy = entity.updatedBy;
    //  response.deletedBy = entity.deletedBy;
    //  response.createdAt = entity.createdAt;
    // response.updatedAt = entity.updatedAt;
    //  response.deletedAt = entity.deletedAt;
    return response;
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { BusinessProcessResponse } from './business-process.response';
import { TaskEntity } from '../entities/task.entity';
import { TaskAssignmentResponse } from './task-assignment.response';
import {
  CreateTaskCkeckListDto,
  TaskCkeckListDto,
} from './task-ckeck-list.dto';

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
  createdAt: Date;
  @ApiProperty()
  taskCheckList: CreateTaskCkeckListDto[];

  assignments?: TaskAssignmentResponse[];
  static toResponse(entity: TaskEntity) {
    const response = new TaskResponse();
    response.id = entity.id;
    response.businessProcessId = entity.bpId;
    response.name = entity.name;
    response.description = entity.description;
    response.handlerType = entity.handlerType;
    response.taskType = entity.taskType;
    response.taskCheckList = entity.checkList;
    // response.createdBy = entity.createdBy;
    //  response.updatedBy = entity.updatedBy;
    //  response.deletedBy = entity.deletedBy;
    //  response.createdAt = entity.createdAt;
    // response.updatedAt = entity.updatedAt;
    //  response.deletedAt = entity.deletedAt;
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
    return response;
  }
}

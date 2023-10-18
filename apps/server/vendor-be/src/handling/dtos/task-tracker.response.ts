import { ApiProperty } from '@nestjs/swagger';
import { TaskResponse } from '../../bpm/dtos/task.response';
import { WorkflowInstanceResponse } from './workflow-instance.response';
import { TaskTrackerEntity } from '../entities/task-tracker';
import { TaskCkeckListDto } from 'src/bpm/dtos/task-ckeck-list.dto';

export class TaskTrackerResponse {
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
  previousHandlerId: string;
  @ApiProperty()
  task?: TaskResponse;
  @ApiProperty()
  workflowInstance?: WorkflowInstanceResponse;
  @ApiProperty()
  action: string;
  @ApiProperty()
  remark?: string;
  @ApiProperty()
  taskChecklist: TaskCkeckListDto[];

  static toResponse(entity: TaskTrackerEntity) {
    const response = new TaskTrackerResponse();
    response.id = entity.id;
    response.taskId = entity.taskId;
    response.instanceId = entity.instanceId;
    response.handlerName = entity.handlerName;
    response.handlerUserId = entity.handlerUserId;
    response.pickedAt = entity.pickedAt;
    response.data = entity.data;
    response.taskChecklist = JSON.parse(entity.checklists);
    response.previousHandlerId = entity.previousHandlerId;
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

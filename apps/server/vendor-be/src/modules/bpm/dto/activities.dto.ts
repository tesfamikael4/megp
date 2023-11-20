import { ApiProperty } from '@nestjs/swagger';
import { TaskResponse } from './task.dto';
import { TaskHandlerResponse } from './task-handler.dto';
import { TaskTrackerResponse } from './task-tracker.dto';

export class ActivityResponseDto {
  @ApiProperty()
  task: TaskResponse;
  @ApiProperty()
  taskTracker: TaskTrackerResponse;
  @ApiProperty()
  taskHandler: TaskHandlerResponse;
}

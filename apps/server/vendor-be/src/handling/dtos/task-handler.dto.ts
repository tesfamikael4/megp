import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { TaskHandlerEntity } from '../entities/task-handler';
import { TaskCheckListDto } from 'src/bpm/dtos/task-check-list.dto';

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

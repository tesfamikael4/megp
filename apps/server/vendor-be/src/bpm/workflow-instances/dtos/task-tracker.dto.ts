import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNotEmpty, IsUUID } from 'class-validator';
import { TaskTrackerEntity } from '../entities/task-tracker';

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
  handledById: string;
  @ApiProperty()
  @IsEmpty()
  data: object;
  @ApiProperty()
  @IsEmpty()
  action: string;
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
    entity.handledById = dto.handledById;
    entity.action = dto.action;
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
export class UpdateTaskTrackerDto {
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
  @IsNotEmpty()
  handledById: string;
  @ApiProperty()
  @IsNotEmpty()
  previousHandlerId: string;
  @ApiProperty()
  @IsEmpty()
  data: object;
  @ApiProperty()
  @IsEmpty()
  action: string;
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
    entity.handledById = dto.handledById;
    entity.previousHandlerId = dto.previousHandlerId;
    return entity;
  }
}
export class DeleteTaskTrackerDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  instanceId: string;
}

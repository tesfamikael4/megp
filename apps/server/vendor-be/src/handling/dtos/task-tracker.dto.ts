import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { TaskTrackerEntity } from '../entities/task-tracker';
import { TaskCheckListDto } from 'src/bpm/dtos/task-check-list.dto';

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
  handlerName: string;
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
    entity.action = dto.action;
    entity.remark = dto.remark;
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
  handlerUserId: string;
  @ApiProperty()
  @IsNotEmpty()
  previousHandlerId: string;
  @ApiProperty()
  @IsString()
  data: object;
  @ApiProperty()
  @IsString()
  action: string;
  @ApiProperty()
  @IsString()
  remark: string;
  @ApiProperty()
  checkLists: TaskCheckListDto[];
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
    entity.previousHandlerId = dto.previousHandlerId;
    entity.remark = dto.remark;
    return entity;
  }
}

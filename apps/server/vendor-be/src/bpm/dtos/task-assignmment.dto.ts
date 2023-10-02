import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { TaskAssignmentEntity } from '../entities/task-assignment';

export class CreateTaskAssignmentDto {
  @ApiProperty()
  @IsNotEmpty()
  taskId: string;
  @ApiProperty()
  @IsNotEmpty()
  assignmentType: string;
  @ApiProperty()
  @IsNotEmpty()
  assigneeId: string;
  @ApiProperty()
  assigneeName: string;
  /**
   * Transfer Data from DTO object to Entity object
   *
   */
  static fromDto(dto: CreateTaskAssignmentDto): TaskAssignmentEntity {
    const entity = new TaskAssignmentEntity();
    if (!dto) {
      return null;
    }
    entity.taskId = dto.taskId;
    entity.assigneeId = dto.assigneeId;
    entity.assignmentType = dto.assignmentType;
    entity.assigneeName = dto.assigneeName;
    return entity;
  }

  /**
   * Transfer list of DTO object to Entity  list
   *
   */
  static fromDtos(dto: CreateTaskAssignmentDto[]): TaskAssignmentEntity[] {
    return dto?.map((d) => CreateTaskAssignmentDto.fromDto(d));
  }
}
export class UpdateTaskAssignmentDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  taskId: string;
  @ApiProperty()
  @IsNotEmpty()
  assigneeId: string;
  @ApiProperty()
  @IsNotEmpty()
  assigneeName: string;
  @ApiProperty()
  @IsNotEmpty()
  assignmentType: string;
  static fromDto(dto: UpdateTaskAssignmentDto): TaskAssignmentEntity {
    const entity = new TaskAssignmentEntity();
    if (!dto) {
      return;
    }
    entity.id = dto.id;
    entity.assigneeId = dto.assigneeId;
    entity.taskId = dto.taskId;
    entity.assignmentType = dto.assignmentType;
    entity.assigneeName = dto.assigneeName;
    entity.assignmentType = dto.assignmentType;
    return entity;
  }
}
export class DeleteTaskAssignmentDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  taskId: string;
}

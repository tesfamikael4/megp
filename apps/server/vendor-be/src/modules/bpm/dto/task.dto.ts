import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { TaskAssignmentResponse } from './task-assignmment.dto';
import { BusinessProcessResponse } from './business-process.dto';
import { CreateTaskCheckListDto } from './task-check-list.dto';
import { TaskEntity } from 'src/entities/task.entity';
export class CreateTaskDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  bpId: string;
  @ApiProperty()
  @IsNotEmpty()
  description: string;
  @ApiProperty()
  @IsNotEmpty()
  handlerType: string;
  @ApiProperty()
  @IsNotEmpty()
  taskType: string;
  @ApiProperty()
  @IsNotEmpty()
  label: string;
  @ApiProperty()
  @IsOptional()
  orderBy: number;
  @ApiProperty()
  taskCkecklist: CreateTaskCheckListDto[];
  /**
   * Transfer Data from DTO object to Entity object
   *
   */
  static fromDto(dto: CreateTaskDto): TaskEntity {
    const entity = new TaskEntity();
    if (!dto) {
      return null;
    }
    entity.name = dto.name;
    entity.description = dto.description;
    entity.bpId = dto.bpId;
    entity.taskType = dto.taskType;
    entity.handlerType = dto.handlerType;
    entity.checkList = dto.taskCkecklist;
    entity.label = dto.label;
    entity.orderBy = dto.orderBy;
    return entity;
  }

  /**
   * Transfer list of DTO object to Entity  list
   *
   */
  static fromDtos(dto: CreateTaskDto[]): TaskEntity[] {
    return dto?.map((d) => CreateTaskDto.fromDto(d));
  }
}
export class UpdateTaskDto extends CreateTaskDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  id: string;

  static fromDto(dto: UpdateTaskDto): TaskEntity {
    const entity = new TaskEntity();
    if (!dto) {
      return;
    }
    entity.id = dto.id;
    entity.description = dto.description;
    entity.name = dto.name;
    entity.bpId = dto.bpId;
    entity.handlerType = dto.handlerType;
    entity.taskType = dto.taskType;
    entity.label = dto.label;
    entity.orderBy = dto.orderBy;
    return entity;
  }
}

export class TaskResponse extends UpdateTaskDto {
  @ApiProperty()
  businessProcess?: BusinessProcessResponse;
  createdAt: Date;
  @ApiProperty()
  taskCheckList: CreateTaskCheckListDto[];
  assignments?: TaskAssignmentResponse[];
  static toResponse(entity: TaskEntity) {
    const response = new TaskResponse();
    response.id = entity.id;
    response.bpId = entity.bpId;
    response.name = entity.name;
    response.description = entity.description;
    response.handlerType = entity.handlerType;
    response.taskType = entity.taskType;
    response.taskCheckList = entity.checkList;
    response.label = entity.label;
    response.orderBy = entity.orderBy;
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

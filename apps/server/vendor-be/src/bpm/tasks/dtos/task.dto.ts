import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { TaskEntity } from '../entities/task.entity';

export class CreateTaskDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  businessProcessId: string;
  @ApiProperty()
  @IsNotEmpty()
  description: string;
  @ApiProperty()
  @IsNotEmpty()
  handlerType: string;
  @ApiProperty()
  @IsNotEmpty()
  type: string;
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
    entity.businessProcessId = dto.businessProcessId;
    entity.type = dto.type;
    entity.handlerType = dto.handlerType;
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
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  handlerType: string;
  @ApiProperty()
  @IsNotEmpty()
  businessProcessId: string;
  @ApiProperty()
  type: string;
  static fromDto(dto: UpdateTaskDto): TaskEntity {
    const entity = new TaskEntity();
    if (!dto) {
      return;
    }
    entity.id = dto.id;
    entity.description = dto.description;
    entity.name = dto.name;
    entity.businessProcessId = dto.businessProcessId;
    entity.handlerType = dto.handlerType;
    entity.type = dto.type;
    entity.businessProcessId = dto.businessProcessId;
    return entity;
  }
}

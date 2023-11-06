import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { WorkflowInstanceEntity } from '../entities/workflow-instance';
import { TaskCheckListDto } from 'src/bpm/dtos/task-check-list.dto';

export class CreateWorkflowInstanceDto {
  @ApiProperty()
  @IsNotEmpty()
  requestorId: string;
  @ApiProperty()
  @IsNotEmpty()
  status: string;
  @ApiProperty()
  @IsOptional()
  serviceId: string;
  @ApiProperty()
  bpId: string;
  pricingId: string;
  createdBy: string;
  data?: any;
  /**
   * Transfer Data from DTO object to Entity object
   *
   **/
  static fromDto(dto: CreateWorkflowInstanceDto): WorkflowInstanceEntity {
    const entity = new WorkflowInstanceEntity();
    if (!dto) {
      return null;
    }
    entity.requestorId = dto.requestorId;
    entity.bpId = dto.bpId;
    entity.serviceId = dto.serviceId;
    entity.status = dto.status;
    entity.submittedAt = new Date();
    return entity;
  }

  /**
   * Transfer list of DTO object to Entity  list
   *
   */
  static fromDtos(dto: CreateWorkflowInstanceDto[]): WorkflowInstanceEntity[] {
    return dto?.map((d) => CreateWorkflowInstanceDto.fromDto(d));
  }
}
export class UpdateWorkflowInstanceDto extends CreateWorkflowInstanceDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  id: string;
  static fromDto(dto: UpdateWorkflowInstanceDto): WorkflowInstanceEntity {
    const entity = new WorkflowInstanceEntity();
    if (!dto) {
      return;
    }
    entity.id = dto.id;
    entity.requestorId = dto.requestorId;
    entity.bpId = dto.bpId;
    entity.serviceId = dto.serviceId;
    entity.status = dto.status;
    entity.submittedAt = new Date();
    return entity;
  }
}
export class GotoNextStateDto {
  @ApiProperty()
  @IsNotEmpty()
  instanceId: string;
  @ApiProperty()
  @IsNotEmpty()
  action: string;
  @ApiProperty()
  @IsOptional()
  remark: string;
  @ApiProperty()
  @IsOptional()
  data: object;
  @ApiProperty()
  handlerId: string;
  @ApiProperty()
  @IsOptional()
  taskChecklist: TaskCheckListDto[];
}

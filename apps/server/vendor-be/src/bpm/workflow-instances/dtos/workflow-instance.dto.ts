import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { WorkflowInstanceEntity } from '../entities/workflow-instance';

export class CreateWorkflowInstanceDto {
  @ApiProperty()
  @IsNotEmpty()
  applicationNumber: string;
  @ApiProperty()
  @IsNotEmpty()
  bpId: string;
  @ApiProperty()
  @IsNotEmpty()
  requestorId: string;
  @ApiProperty()
  @IsNotEmpty()
  status: string;
  /**
   * Transfer Data from DTO object to Entity object
   *
   */
  static fromDto(dto: CreateWorkflowInstanceDto): WorkflowInstanceEntity {
    const entity = new WorkflowInstanceEntity();
    if (!dto) {
      return null;
    }
    entity.applicationNumber = dto.applicationNumber;
    entity.requestorId = dto.requestorId;
    entity.bpId = dto.bpId;
    entity.status = dto.status;
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
  @ApiProperty()
  @IsNotEmpty()
  applicationNumber: string;
  @ApiProperty()
  requestorId: string;
  @ApiProperty()
  status: string;
  @ApiProperty()
  @IsNotEmpty()
  bpId: string;
  static fromDto(dto: UpdateWorkflowInstanceDto): WorkflowInstanceEntity {
    const entity = new WorkflowInstanceEntity();
    if (!dto) {
      return;
    }
    entity.id = dto.id;
    entity.requestorId = dto.requestorId;
    entity.applicationNumber = dto.applicationNumber;
    entity.bpId = dto.bpId;
    entity.status = dto.status;
    entity.bpId = dto.bpId;
    return entity;
  }
}

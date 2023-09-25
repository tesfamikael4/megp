import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { WorkflowInstanceEntity } from '../entities/workflow-instance';

export class CreateWorkflowInstanceDto {
  // @ApiProperty()
  // @IsNotEmpty()
  // bpId: string;
  @ApiProperty()
  @IsNotEmpty()
  requestorId: string;
  @ApiProperty()
  @IsNotEmpty()
  status: string;
  @ApiProperty()
  @IsNotEmpty()
  pricingId: string;
  //@ApiProperty()
  //@IsNotEmpty()
  key: string;
  createdBy: string;
  /**
   * Transfer Data from DTO object to Entity object
   *
   */
  static fromDto(dto: CreateWorkflowInstanceDto): WorkflowInstanceEntity {
    const entity = new WorkflowInstanceEntity();
    if (!dto) {
      return null;
    }
    entity.requestorId = dto.requestorId;
    entity.pricingId = dto.pricingId;
    entity.status = dto.status;
    entity.createdBy = dto.createdBy;
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
    entity.pricingId = dto.pricingId;
    entity.status = dto.status;
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
  @IsNotEmpty()
  data: object;
  @ApiProperty()
  @IsNotEmpty()
  handlerId: string;
  @ApiProperty()
  @IsString()
  remark: string;
}

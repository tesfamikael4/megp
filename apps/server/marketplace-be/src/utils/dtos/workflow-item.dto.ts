import { IsUUID, IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkflowItemDto {
  @ApiProperty()
  @IsUUID()
  objectId: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  step: number;

  approverId: string;
  organizationName: string;
  organizationId: string;
  isComplete: boolean;
  isCurrent: boolean;
  version: number;
}

export class UpdateWorkflowItemDto extends CreateWorkflowItemDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

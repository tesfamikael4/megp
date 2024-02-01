import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
export class CreateRequisitionerAssignmentDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsUUID()
  annualProcurementPlanId: string;

  @ApiProperty()
  @IsUUID()
  userId: string;
}

export class UpdateRequisitionerAssignmentDto extends CreateRequisitionerAssignmentDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class RequisitionerAssignmentResponseDto extends UpdateRequisitionerAssignmentDto {}

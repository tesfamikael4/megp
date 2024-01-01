import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsJSON, IsUUID } from 'class-validator';
export class CreateProcurementRequisitionActivityDto {
  @ApiProperty()
  @IsUUID()
  procurementRequisitionId: string;

  @ApiProperty()
  @IsUUID()
  annualProcurementPlanActivityId: string;

  @ApiProperty()
  @IsJSON()
  annualProcurementPlan: JSON;
}

export class UpdateProcurementRequisitionActivityDto extends CreateProcurementRequisitionActivityDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class ProcurementRequisitionActivityResponseDto extends UpdateProcurementRequisitionActivityDto {}

export class AssignAnnualProcurementPlanActivityDto {
  @ApiProperty()
  @IsUUID()
  procurementRequisitionId: string;

  @ApiProperty()
  @IsArray()
  annualProcurementPlanActivity: string[];
}

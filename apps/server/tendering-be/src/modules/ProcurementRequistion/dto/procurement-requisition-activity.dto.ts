import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsArray } from 'class-validator';
export class AssignPostBudgetPlanActivityDto {
  @ApiProperty()
  @IsUUID()
  procurementRequisitionId: string;

  @ApiProperty()
  @IsArray()
  postBudgetPlanActivity: string[];
}

export class AssignProcurementRequisitionDto {
  @ApiProperty()
  @IsUUID()
  postBudgetPlanActivityId: string;

  @ApiProperty()
  @IsArray()
  procurementRequisition: string[];
}

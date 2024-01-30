import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID } from 'class-validator';
export class CreateProcurementRequisitionBudgetLineDto {
  @ApiProperty()
  @IsUUID()
  procurementRequisitionId: string;

  @ApiProperty()
  @IsUUID()
  annualProcurementPlanBudgetLineId: string;

  @ApiProperty()
  @IsNumber()
  amount: number;
}

export class UpdateProcurementRequisitionBudgetLineDto extends CreateProcurementRequisitionBudgetLineDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class ProcurementRequisitionBudgetLineResponseDto extends UpdateProcurementRequisitionBudgetLineDto {}

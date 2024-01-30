import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsNumber, IsString, IsUUID } from 'class-validator';
export class CreateAnnualProcurementPlanDisbursementDto {
  @ApiProperty()
  @IsString()
  quarter: string;

  @ApiProperty()
  @IsNumber()
  order: number;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsString()
  currency: string;

  @ApiProperty()
  @IsUUID()
  annualProcurementPlanActivityId: string;

  @ApiProperty()
  @IsJSON()
  budgetYear: JSON;
}

export class UpdateAnnualProcurementPlanDisbursementDto extends CreateAnnualProcurementPlanDisbursementDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class AnnualProcurementPlanDisbursementResponseDto extends UpdateAnnualProcurementPlanDisbursementDto {}

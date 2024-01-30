import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsNumber, IsString, IsUUID } from 'class-validator';
export class BudgetYear {
  @ApiProperty()
  @IsUUID()
  budgetYearId: string;

  @ApiProperty()
  @IsString()
  budgetYear: string;
}

export class CreateAnnualProcurementPlanBudgetLineDto {
  @ApiProperty()
  @IsUUID()
  annualProcurementPlanActivityId: string;

  @ApiProperty()
  @IsString()
  budgetCode: string;

  @ApiProperty()
  @IsString()
  fundingSource: string;

  @ApiProperty()
  @IsString()
  currency: string;

  @ApiProperty()
  @IsJSON()
  budgetYear: BudgetYear;

  @ApiProperty()
  @IsNumber()
  amount: number;
}

export class UpdateAnnualProcurementPlanBudgetLineDto extends CreateAnnualProcurementPlanBudgetLineDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class AnnualProcurementPlanBudgetLineResponseDto extends UpdateAnnualProcurementPlanBudgetLineDto {}

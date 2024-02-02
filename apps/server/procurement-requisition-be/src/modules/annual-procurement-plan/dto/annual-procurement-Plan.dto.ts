import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsJSON } from 'class-validator';

export class BudgetYear {
  @ApiProperty()
  @IsUUID()
  budgetYearId: string;

  @ApiProperty()
  @IsString()
  budgetYear: string;
}
export class CreateAnnualProcurementPlanDto {
  @ApiProperty()
  @IsJSON()
  organization: JSON;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsJSON()
  budgetYear: BudgetYear;

  @ApiProperty()
  @IsString()
  status: string;
}

export class UpdateAnnualProcurementPlanDto extends CreateAnnualProcurementPlanDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class CreateAnnualProcurementPlanDtoResponseDto extends UpdateAnnualProcurementPlanDto {}

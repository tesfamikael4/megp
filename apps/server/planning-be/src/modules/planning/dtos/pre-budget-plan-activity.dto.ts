import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsJSON,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreatePreBudgetPlanActivityDto {
  @ApiProperty()
  @IsUUID()
  preBudgetPlanId: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  totalEstimatedAmount: number;

  @ApiProperty()
  @IsString()
  currency: string;

  @ApiProperty()
  @IsString()
  fundingSource: string;

  @ApiProperty()
  @IsString()
  procurementMethod: string;

  @ApiProperty()
  @IsString()
  procurementType: string;

  @ApiProperty()
  @IsString()
  procurementStatus: string;

  @ApiProperty()
  @IsJSON()
  donor: JSON;

  @ApiProperty()
  @IsBoolean()
  isMultiYear: boolean;

  @ApiProperty()
  @IsJSON()
  multiYearBudget: JSON;

  @ApiProperty()
  @IsBoolean()
  indigenousPreference: boolean;

  @ApiProperty()
  @IsJSON()
  preferenceValue: JSON;

  @ApiProperty()
  @IsJSON()
  @IsOptional()
  remark: string;
}

export class UpdatePreBudgetPlanActivityDto extends CreatePreBudgetPlanActivityDto {
  @ApiProperty()
  @IsString()
  id: string;
}

export class PreBudgetPlanResponseActivityDto extends UpdatePreBudgetPlanActivityDto {}

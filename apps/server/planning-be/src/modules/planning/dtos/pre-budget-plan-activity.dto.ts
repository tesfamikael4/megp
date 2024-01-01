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
  procurementReference: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  estimatedAmount: number;

  @ApiProperty()
  @IsNumber()
  calculatedAmount: number;

  @ApiProperty()
  @IsString()
  currency: string;

  @ApiProperty()
  @IsString()
  status: string;

  @ApiProperty()
  @IsBoolean()
  isMultiYear: boolean;

  @ApiProperty()
  @IsJSON()
  @IsOptional()
  remark: string;

  @ApiProperty()
  @IsBoolean()
  classification: any;
}

export class UpdatePreBudgetPlanActivityDto extends CreatePreBudgetPlanActivityDto {
  @ApiProperty()
  @IsString()
  id: string;
}

export class PreBudgetPlanResponseActivityDto extends UpdatePreBudgetPlanActivityDto {}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
export class CreateAnnualProcurementPlanActivityDto {
  @ApiProperty()
  @IsUUID()
  postBudgetPlanId: string;

  @ApiProperty()
  @IsString()
  procurementReferenceNumber: string;

  @ApiProperty()
  @IsString()
  activityName: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  estimatedAmount: number;

  @ApiProperty()
  @IsNumber()
  calculatedPrice: number;

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
  classification: string;

  @ApiProperty()
  @IsUUID()
  annualProcurementPlanId: string;
}

export class UpdateAnnualProcurementPlanActivityDto extends CreateAnnualProcurementPlanActivityDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class AnnualProcurementPlanActivityResponseDto extends UpdateAnnualProcurementPlanActivityDto {}

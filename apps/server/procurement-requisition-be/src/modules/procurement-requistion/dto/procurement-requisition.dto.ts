import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsNumber, IsJSON } from 'class-validator';

export class BudgetYear {
  @ApiProperty()
  @IsUUID()
  budgetYearId: string;

  @ApiProperty()
  @IsString()
  budgetYear: string;
}
export class CreateProcurementRequisitionDto {
  @ApiProperty()
  @IsJSON()
  organization: JSON;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  requisitionReferenceNumber: string;

  @ApiProperty()
  @IsString()
  userReferenceNumber: string;

  @ApiProperty()
  @IsJSON()
  budgetYear: BudgetYear;

  @ApiProperty()
  @IsNumber()
  totalEstimatedAmount = 0.0;

  @ApiProperty()
  @IsNumber()
  calculatedAmount = 0.0;

  @ApiProperty({ default: 'USD' })
  @IsString()
  currency: string;

  @ApiProperty()
  @IsString()
  status: string;
}

export class UpdateProcurementRequisitionDto extends CreateProcurementRequisitionDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class ProcurementRequisitionResponseDto extends UpdateProcurementRequisitionDto {}

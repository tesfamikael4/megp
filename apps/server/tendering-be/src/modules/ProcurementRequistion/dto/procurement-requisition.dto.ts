import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsNumber } from 'class-validator';
export class CreateProcurementRequisitionDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  referenceNumber: string;

  @ApiProperty()
  @IsNumber()
  totalEstimatedAmount: number;

  @ApiProperty()
  @IsString()
  status: string;

  @ApiProperty()
  @IsUUID()
  postBudgetPlanId: string;
}

export class UpdateProcurementRequisitionDto extends CreateProcurementRequisitionDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class ProcurementRequisitionResponseDto extends UpdateProcurementRequisitionDto {}

import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsNumber, IsString, IsUUID } from 'class-validator';
export class CreateProcurementRequisitionDisbursementDto {
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
  procurementRequisitionId: string;

  @ApiProperty()
  @IsJSON()
  budgetYear: JSON;
}

export class UpdateProcurementRequisitionDisbursementDto extends CreateProcurementRequisitionDisbursementDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class ProcurementRequisitionDisbursementResponseDto extends UpdateProcurementRequisitionDisbursementDto {}

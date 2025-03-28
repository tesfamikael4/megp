import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID } from 'class-validator';
export class CreateProcurementRequisitionItemDto {
  @ApiProperty()
  @IsString()
  itemCode: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  unitPrice: number;

  @ApiProperty()
  @IsString()
  currency: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsString()
  measurement: string;

  @ApiProperty()
  classification: JSON;

  @ApiProperty()
  budgetId: string;

  @ApiProperty()
  @IsString()
  uom: string;

  @ApiProperty()
  @IsString()
  bom: string;

  @ApiProperty()
  @IsUUID()
  procurementRequisitionId: string;
}

export class UpdateProcurementRequisitionItemDto extends CreateProcurementRequisitionItemDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class ProcurementRequisitionItemResponseDto extends UpdateProcurementRequisitionItemDto {}

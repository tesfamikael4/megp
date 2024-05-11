import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateRfxItemDto {
  @IsUUID()
  RfxId: string;

  @IsUUID()
  prItemId: string;

  @IsString()
  itemCode: string;

  @IsString()
  description: string;

  @IsNumber()
  unitPrice: number;

  @IsString()
  currency: string;

  @IsNumber()
  quantity: number;

  @IsString()
  measurement: string;

  classification: JSON;

  budgetId: string;

  @IsString()
  uom: string;

  @IsString()
  bom: string;
}

export class UpdateRfxItemDto extends CreateRfxItemDto {
  @IsUUID()
  id: string;
}

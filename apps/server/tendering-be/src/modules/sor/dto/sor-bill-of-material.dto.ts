import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class CreateSorBillOfMaterialDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  itemId: string;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  @IsOptional()
  parentId?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  payItem: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  unit: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  rate: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  amount: number;
}

export class UpdateSorBillOfMaterialDto extends CreateSorBillOfMaterialDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  id: string;
}

export class SorBillOfMaterialResponseDto extends UpdateSorBillOfMaterialDto {}

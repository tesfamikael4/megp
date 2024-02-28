import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsUUID,
  IsOptional,
  IsArray,
} from 'class-validator';

export class CreateSorBillOfMaterialDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  itemId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  payItem: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  description: string;

  @IsNotEmpty()
  @IsString()
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

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  code: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  parentCode: string;
}

export class UpdateSorBillOfMaterialDto extends CreateSorBillOfMaterialDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  id: string;
}

export class SorBillOfMaterialResponseDto extends UpdateSorBillOfMaterialDto {}

export class BulkCreateBillOfMaterialDto {
  @ApiProperty({ isArray: true, type: () => CreateSorBillOfMaterialDto })
  @IsArray()
  boqs: CreateSorBillOfMaterialDto[];
}

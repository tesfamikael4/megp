import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsUUID,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateSorEquipmentsDto {
  @IsString()
  @IsUUID()
  @ApiProperty()
  itemId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  itemNumber: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  unit: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  quantity: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  rate: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  amount: number;
}

export class UpdateSorEquipmentsDto extends CreateSorEquipmentsDto {
  @IsString()
  @IsUUID()
  @ApiProperty()
  id: string;
}

export class SorEquipmentsResponseDto extends UpdateSorEquipmentsDto {}

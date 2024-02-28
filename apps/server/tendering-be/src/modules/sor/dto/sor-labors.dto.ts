import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUUID,
  IsString,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateSorLaborsDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  itemId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  itemNumber: string;

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

  @IsOptional()
  @ApiProperty()
  @IsNumber()
  rate: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  amount: number;
}

export class UpdateSorLaborsDto extends CreateSorLaborsDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  id: string;
}

export class SorLaborsResponseDto extends UpdateSorLaborsDto {}

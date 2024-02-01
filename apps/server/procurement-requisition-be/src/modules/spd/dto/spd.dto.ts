import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsUUID,
  IsObject,
} from 'class-validator';

export class CreateSpdDto {
  @ApiProperty()
  @IsObject()
  governingRule: any;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  language: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  procurementCategory: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  marketType: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  procurementTool: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contractingMethod: string;

  @ApiProperty()
  @IsObject()
  specializationType: any;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;
}

export class UpdateSpdDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class SpdResponseDto extends UpdateSpdDto {}

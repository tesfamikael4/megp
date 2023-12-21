import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  IsObject,
} from 'class-validator';

export class CreateSpdBdsDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  category: string;

  @ApiProperty()
  @IsString()
  prefix: string;

  @ApiProperty()
  @IsString()
  itbReference: string;

  @ApiProperty()
  @IsString()
  attribute: string;

  @ApiProperty()
  @IsObject()
  value: any;

  @ApiProperty()
  @IsString()
  mandate: string;

  @ApiProperty()
  @IsString()
  inputType: string;

  @ApiProperty()
  @IsNumber()
  order: number;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsObject()
  dependency: any;

  @ApiProperty()
  @IsBoolean()
  readOnly: boolean;

  @ApiProperty()
  @IsBoolean()
  isRequired: boolean;

  @ApiProperty()
  @IsBoolean()
  isInternalUse: boolean;
}

export class UpdateSpdBdsDto extends CreateSpdBdsDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class SpdBdsResponseDto extends UpdateSpdBdsDto {}

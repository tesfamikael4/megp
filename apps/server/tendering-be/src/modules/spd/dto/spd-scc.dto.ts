import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  IsObject,
} from 'class-validator';

export class CreateSpdSccDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @ApiProperty()
  itbReference: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  attribute: string;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty()
  value: any;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  manadate: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  inputType: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  order: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
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
  @IsString()
  prefix: string;
}

export class UpdateSpdSccDto extends CreateSpdSccDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class SpdSccResponseDto extends UpdateSpdSccDto {}

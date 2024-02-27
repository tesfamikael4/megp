import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsObject,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class CreateSpdQualificationDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  spdId: string;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  factor: any;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  category: any;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  requirement: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  formLink: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  itbReference: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  itbDescription: string;
}

export class UpdateSpdQualificationDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class SpdQualificationResponseDto extends UpdateSpdQualificationDto {}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateSpdSettingsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  spdId: string;

  @ApiProperty()
  @IsObject()
  sectionLink: any;

  @ApiProperty()
  @IsObject()
  evidenceType: any;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  evidenceTitle: string;

  @ApiProperty()
  @IsBoolean()
  checkOnFirstOpening: boolean;

  @ApiProperty()
  @IsBoolean()
  checkOnSecondOpening: boolean;

  @ApiProperty()
  @IsBoolean()
  checkOnSecondCompilance: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  requiredTo: string;

  @ApiProperty()
  @IsBoolean()
  isRequired: boolean;
}

export class UpdateSpdSettingsDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class SpdSettingsResponseDto extends UpdateSpdSettingsDto {}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateSpdRequiredDocumentaryEvidencesDto {
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
  @IsString()
  requiredTo: string;

  @ApiProperty()
  @IsBoolean()
  isRequired: boolean;
}

export class UpdateSpdRequiredDocumentaryEvidencesDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class SpdRequiredDocumentaryEvidencesResponseDto extends UpdateSpdRequiredDocumentaryEvidencesDto {}

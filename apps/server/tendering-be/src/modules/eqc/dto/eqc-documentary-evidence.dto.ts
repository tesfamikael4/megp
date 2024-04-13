import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateEqcDocumentaryEvidenceDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  spdId: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  checkOnFirstCompliance: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  checkOnFirstOpening: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  checkOnSecondCompliance: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  checkOnSecondOpening: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  evidenceTitle: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  evidenceType: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  spdDocumentaryEvidenceId: string;
}

export class UpdateEqcDocumentaryEvidenceDto extends CreateEqcDocumentaryEvidenceDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class EqcDocumentaryEvidenceResponseDto extends UpdateEqcDocumentaryEvidenceDto {}

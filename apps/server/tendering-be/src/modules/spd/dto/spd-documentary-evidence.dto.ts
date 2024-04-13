import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsBoolean } from 'class-validator';

export class CreateSpdDocumentaryEvidenceDto {
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
}

export class UpdateSpdDocumentaryEvidenceDto extends CreateSpdDocumentaryEvidenceDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class SpdDocumentaryEvidenceResponseDto extends UpdateSpdDocumentaryEvidenceDto {}

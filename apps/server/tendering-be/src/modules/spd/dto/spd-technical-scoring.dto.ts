import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsString,
  IsUUID,
  IsObject,
  IsNotEmpty,
} from 'class-validator';

export class CreateSpdTechnicalScoringDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  spdId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  parentId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  requirement: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  formLink: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isProfessional: boolean;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  validation: any;
}

export class UpdateSpdTechnicalScoringDto extends CreateSpdTechnicalScoringDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class SpdTechnicalScoringResponseDto extends UpdateSpdTechnicalScoringDto {}

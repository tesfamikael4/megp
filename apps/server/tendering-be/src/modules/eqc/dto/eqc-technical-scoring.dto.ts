import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class ValidationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  min: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  max: number;
}

export class UpdateEqcTechnicalScoringDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  lotId!: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  parentId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  requirement: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  requirementCondition: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  point: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  formLink: string;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => ValidationDto)
  validation: ValidationDto;
}

export class SpdPreferenceMarginResponseDto extends UpdateEqcTechnicalScoringDto {}

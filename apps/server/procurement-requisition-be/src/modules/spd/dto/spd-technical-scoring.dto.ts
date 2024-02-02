import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsString,
  IsUUID,
  IsObject,
} from 'class-validator';

export class CreateSpdTechnicalScoringDto {
  @ApiProperty()
  @IsNumber()
  orderNo: number;

  @ApiProperty()
  @IsString()
  parentId: string;

  @ApiProperty()
  @IsString()
  requirement: string;

  @ApiProperty()
  @IsString()
  specification: string;

  @ApiProperty()
  @IsString()
  requirementCondition: string;

  @ApiProperty()
  @IsNumber()
  point: number;

  @ApiProperty()
  @IsString()
  formLink: string;

  @ApiProperty()
  @IsString()
  additionalRequirements: string;

  @ApiProperty()
  @IsObject()
  validation: any;

  @ApiProperty()
  @IsBoolean()
  isRequired: boolean;

  @ApiProperty()
  @IsBoolean()
  isProfessional: boolean;

  @ApiProperty()
  @IsBoolean()
  isRangeBasedCriteria: boolean;
}

export class UpdateSpdTechnicalScoringDto extends CreateSpdTechnicalScoringDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class SpdTechnicalScoringResponseDto extends UpdateSpdTechnicalScoringDto {}

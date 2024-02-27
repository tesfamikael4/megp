import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsUUID,
  IsNumber,
  IsObject,
  IsNotEmpty,
  IsNotEmptyObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSpdProfessionalSettingValidationDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  min: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  max: number;
}

export class CreateSpdProfessionalSettingDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  spdId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  formLink: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  requirement: string;

  @ApiProperty()
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateSpdProfessionalSettingValidationDto)
  validation: CreateSpdProfessionalSettingValidationDto;
}

export class UpdateSpdProfessionalSettingDto extends CreateSpdProfessionalSettingDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class SpdProfessionalSettingResponseDto extends UpdateSpdProfessionalSettingDto {}

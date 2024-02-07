import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsObject, IsUUID } from 'class-validator';

export class CreateSpdQualificationsDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  spdId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  factor: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  requirement: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  attribute: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  singleEntityCondition: any;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  jvCominedCondition: any;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  jvEachPartherCondition: any;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  jvAtleastOnePartnerCondition: any;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  order: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  formLink: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  mandate: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  itbDescription: string;
}

export class UpdateSpdQualificationsDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class SpdQualificationsResponseDto extends UpdateSpdQualificationsDto {}

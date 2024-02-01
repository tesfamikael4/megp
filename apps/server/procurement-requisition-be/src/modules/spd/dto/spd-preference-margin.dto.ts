import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateSpdPreferenceMarginsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  spdId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  condition: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  preferenceType: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  margin: number;
}

export class UpdateSpdPreferenceMarginsDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class SpdPreferenceMarginsResponseDto extends UpdateSpdPreferenceMarginsDto {}

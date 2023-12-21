import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateSpdPrefeenceMarginsDto {
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

export class UpdateSpdPrefeenceMarginsDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class SpdPrefeenceMarginsResponseDto extends UpdateSpdPrefeenceMarginsDto {}

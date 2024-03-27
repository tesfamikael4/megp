import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsBoolean } from 'class-validator';

export class CreateSpdOpeningChecklistDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  spdId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isBoolean: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string;
}

export class UpdateSpdOpeningChecklistDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class SpdOpeningChecklistResponseDto extends UpdateSpdOpeningChecklistDto {}

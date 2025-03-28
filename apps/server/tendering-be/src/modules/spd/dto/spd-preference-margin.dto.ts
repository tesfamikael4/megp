import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateSpdPreferenceMarginDto {
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
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  margin: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  itbReference: string;

  @ApiProperty()
  @IsString()
  @IsString()
  itbDescription?: string;
}

export class UpdateSpdPreferenceMarginDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class SpdPreferenceMarginResponseDto extends UpdateSpdPreferenceMarginDto {}

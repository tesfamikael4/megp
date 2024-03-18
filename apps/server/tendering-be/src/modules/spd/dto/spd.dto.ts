import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateSpdDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  marketType: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  procurementCategory: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}

export class UpdateSpdDto extends CreateSpdDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class ToggleIsActiveDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class SpdResponseDto extends UpdateSpdDto {}

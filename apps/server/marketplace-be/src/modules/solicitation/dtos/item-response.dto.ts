import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateSolItemResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  rfxItemId: string;

  @IsOptional()
  @IsUUID()
  vendorId: string;

  @ApiProperty()
  @IsString()
  value: string;
}

export class UpdateSolItemResponseDto extends CreateSolItemResponseDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

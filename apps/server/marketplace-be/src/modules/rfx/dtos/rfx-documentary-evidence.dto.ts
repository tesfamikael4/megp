import {
  IsString,
  IsUUID,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRfxDocumetaryEvidenceDto {
  @ApiProperty()
  @IsUUID()
  rfxId: string;

  @ApiProperty()
  @IsBoolean()
  required: boolean;

  @ApiProperty()
  @IsString()
  documentTitle: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  order: number;
}

export class UpdateRfxDocumetaryEvidenceDto extends CreateRfxDocumetaryEvidenceDto {
  @ApiProperty()
  @IsString()
  id: string;
}

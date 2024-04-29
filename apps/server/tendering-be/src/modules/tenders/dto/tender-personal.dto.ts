import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsInt,
  IsUUID,
} from 'class-validator';

export class CreateTenderPersonalDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  tenderId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  position: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  evaluated: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  order: number;
}

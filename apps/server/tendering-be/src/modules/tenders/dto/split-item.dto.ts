import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class SplitItemDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  tenderId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  lotId?: string;

  @ApiProperty()
  @IsArray()
  @IsUUID('all', { each: true })
  @ArrayMinSize(1)
  itemIds: string[];
}

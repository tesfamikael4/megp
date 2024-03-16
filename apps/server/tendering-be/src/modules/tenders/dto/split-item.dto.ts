import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsOptional, IsUUID } from 'class-validator';

export class SplitItemDto {
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

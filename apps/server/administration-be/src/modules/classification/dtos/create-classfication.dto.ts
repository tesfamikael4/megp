import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateClassificationDto {
  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsString()
  parentCode: string;

  @ApiProperty()
  @IsString()
  definition?: string;

  @ApiProperty()
  @IsString()
  synonym?: string;

  @ApiProperty()
  @IsString()
  acronym?: string;

  @ApiProperty()
  @IsString()
  key: string;
}

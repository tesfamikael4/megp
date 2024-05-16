import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ChangeQualificationCategoryDto {
  @ApiProperty()
  @IsUUID()
  lotId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  oldCategory: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  newCategory: string;
}

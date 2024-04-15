import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateItemCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsOptional()
  parentId: string;
}

export class UpdateItemCategoryDto extends CreateItemCategoryDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}
export class ItemCategoryResponseDto extends UpdateItemCategoryDto {}

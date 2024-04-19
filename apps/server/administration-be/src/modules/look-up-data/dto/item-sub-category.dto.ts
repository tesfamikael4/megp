import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateItemSubCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(['Goods', 'Service', 'Work'])
  parentCategories: string;
}

export class UpdateItemSubCategoryDto extends CreateItemSubCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
}

import { ApiProperty } from '@nestjs/swagger/dist';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ItemTag } from 'src/entities/item-tag.entity';
import { Tag } from 'src/entities/tag.entity';

export class CreateItemMasterDto {
  @ApiProperty()
  @IsString()
  itemCode: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  commodityCode: string;

  @ApiProperty()
  @IsString()
  commodityName: string;

  @ApiProperty()
  @IsUUID()
  itemCategoryId: string;

  @ApiProperty()
  @IsUUID()
  itemSubCategoryId: string;

  @ApiProperty()
  @IsUUID()
  measurementId: string;

  @ApiProperty()
  @IsUUID()
  uOMId: string;

  @ApiProperty()
  @IsString()
  uOMName: string;

  @ApiProperty({ type: [Tag] })
  @IsArray()
  @IsOptional()
  itemTags: ItemTag[];
}

export class UpdateItemMasterDto extends CreateItemMasterDto {
  @ApiProperty({
    format: 'uuid',
    required: true,
  })
  @IsUUID()
  id: string;
  @ApiProperty({ required: true })
  @IsBoolean()
  isActive: boolean;
}

export class ItemMasterResponseDto extends UpdateItemMasterDto {}

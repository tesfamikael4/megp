import { ApiProperty } from '@nestjs/swagger/dist';
import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';
import { ItemMaster } from '../entities/item-master.entity';
import { Tag } from '../entities/tag.entity';
import { ItemTag } from '../entities/item-tag.entity';

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
  itemSubcategoryId: string;
  @ApiProperty()
  @IsString()
  itemSubcategoryName: string;
  @ApiProperty()
  @IsString()
  uOMId: string;
  @ApiProperty()
  @IsString()
  uOMName: string;
  @ApiProperty({ type: [Tag] })
  @IsArray()
  @IsOptional()
  itemTags: ItemTag[];

  static fromDto(dto: CreateItemMasterDto): ItemMaster {
    const entity = new ItemMaster();
    entity.itemCode = dto.itemCode;
    entity.description = dto.description;
    entity.commodityCode = dto.commodityCode;
    entity.commodityName = dto.commodityName;
    entity.itemSubcategoryId = dto.itemSubcategoryId;
    entity.itemSubcategoryName = dto.itemSubcategoryName;
    entity.uOMId = dto.uOMId;
    entity.uOMName = dto.uOMName;
    entity.itemTags = dto.itemTags;
    return entity;
  }
  static toDto(entity: ItemMaster): CreateItemMasterDto {
    const dto = new CreateItemMasterDto();
    dto.itemCode = entity.itemCode;
    dto.description = entity.description;
    dto.commodityCode = entity.commodityCode;
    dto.commodityName = entity.commodityName;
    dto.itemSubcategoryId = entity.itemSubcategoryId;
    dto.itemSubcategoryName = entity.itemSubcategoryName;
    dto.uOMId = entity.uOMId;
    dto.uOMName = entity.uOMName;
    dto.itemTags = entity.itemTags;
    return dto;
  }
  static toDtos(items: ItemMaster[]) {
    return items?.map((item) => this.toDto(item));
  }
}

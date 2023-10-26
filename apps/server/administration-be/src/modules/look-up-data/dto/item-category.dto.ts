import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { ItemCategory } from 'src/entities/item-category.entity';

export class CreateItemCategoryDto {
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  parentId: string;

  static fromDto(dto: CreateItemCategoryDto): ItemCategory {
    const entity = new ItemCategory();
    if (!dto) {
      return null;
    }
    entity.name = dto.name;
    entity.parentId = dto.parentId;
    return entity;
  }

  static fromDtos(dto: CreateItemCategoryDto[]): ItemCategory[] {
    return dto?.map((d) => CreateItemCategoryDto.fromDto(d));
  }
}

export class UpdateItemCategoryDto extends CreateItemCategoryDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  static fromDto(dto: UpdateItemCategoryDto): ItemCategory {
    const entity = new ItemCategory();
    if (!dto) {
      return;
    }
    entity.id = dto.id;
    entity.name = dto.name;
    entity.parentId = dto.parentId;
    entity.createdAt = new Date();
    return entity;
  }
}
export class ItemCategoryResponseDto extends UpdateItemCategoryDto {
  // @ApiProperty()
  // @IsNotEmpty()
  // subCatItem: ItemCategoryResponseDto[];

  @ApiProperty({ type: ItemCategoryResponseDto, isArray: true })
  childCategories: ItemCategoryResponseDto[];

  static fromEntity(entity: ItemCategory): ItemCategoryResponseDto {
    const response = new ItemCategoryResponseDto();
    response.id = entity.id;
    response.name = entity.name;
    response.parentId = entity.parentId;
    // response.subCatItem = []; // Initialize the subCatItem property
    response.childCategories = []; // Initialize the childCategories property
    return response;
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateItemCategoryDto,
  ItemCategoryResponseDto,
} from '../dto/item-category.dto';
import { DataResponseFormat } from 'src/shared/api-data';
import { CollectionQuery, QueryConstructor } from 'src/shared/collection-query';
import { EntityCrudService } from 'src/shared/service';
import { ItemCategory } from 'src/entities/item-category.entity';

@Injectable()
export class ItemCategoryService extends EntityCrudService<ItemCategory> {
  constructor(
    @InjectRepository(ItemCategory)
    private readonly itemCatRepository: Repository<ItemCategory>,
  ) {
    super(itemCatRepository);
  }
  async findAllCateAndSubCat(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<ItemCategoryResponseDto>> {
    try {
      const response = await super.findAll(query);
      const newResponse: DataResponseFormat<ItemCategoryResponseDto> = {
        total: response.total,
        items: this.buildCatAndSubCat(response.items, null),
      };
      return newResponse;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  private buildCatAndSubCat(
    items: ItemCategory[],
    parentId: string | null,
  ): ItemCategoryResponseDto[] {
    const catTree: ItemCategoryResponseDto[] = [];

    items.forEach((item) => {
      if (item.parentId === parentId) {
        const newItem: ItemCategoryResponseDto = {
          id: item.id,
          name: item.name,
          parentId: item.parentId,
          // subCatItem: [], // Initialize the subCatItem property
          childCategories: this.buildCatAndSubCat(items, item.id),
        };
        catTree.push(newItem);
      }
    });

    return catTree;
  }
}

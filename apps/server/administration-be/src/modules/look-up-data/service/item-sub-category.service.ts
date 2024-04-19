import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemSubCategory } from 'src/entities/item-sub-category.entity';
import { EntityCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class ItemSubCategoryService extends EntityCrudService<ItemSubCategory> {
  constructor(
    @InjectRepository(ItemSubCategory)
    private readonly itemSubCategoryRepository: Repository<ItemSubCategory>,
  ) {
    super(itemSubCategoryRepository);
  }

  async getItemsByParentCategory(
    parentCategory: string,
  ): Promise<ItemSubCategory[]> {
    return await this.itemSubCategoryRepository.find({
      where: { parentCategories: parentCategory },
    });
  }
}

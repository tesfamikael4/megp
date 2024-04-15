import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateItemCategoryDto,
  UpdateItemCategoryDto,
} from '../dto/item-category.dto';
import { ItemCategoryService } from '../service/item-category.service';
import { ItemCategory } from 'src/entities/item-category.entity';
import { EntityCrudController } from 'src/shared/controller';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
const options: EntityCrudOptions = {
  createDto: CreateItemCategoryDto,
  updateDto: UpdateItemCategoryDto,
};
@Controller('item-categories')
@ApiTags('Item Categories')
export class ItemCategoriesController extends EntityCrudController<ItemCategory>(
  options,
) {
  constructor(private readonly itemCategoryService: ItemCategoryService) {
    super(itemCategoryService);
  }

  @Post()
  async createUniqueData(
    @Body() dto: CreateItemCategoryDto,
  ): Promise<ItemCategory> {
    return this.itemCategoryService.createUniqueItemCat(dto);
  }
}

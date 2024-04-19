import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import {
  CreateItemSubCategoryDto,
  UpdateItemSubCategoryDto,
} from '../dto/item-sub-category.dto';
import { EntityCrudController } from 'src/shared/controller';
import { ItemSubCategory } from 'src/entities/item-sub-category.entity';
import { ItemSubCategoryService } from '../service/item-sub-category.service';

const options: EntityCrudOptions = {
  createDto: CreateItemSubCategoryDto,
  updateDto: UpdateItemSubCategoryDto,
};
@Controller('item-sub-category')
@ApiTags('Item Sub Category')
export class ItemSubCategoryController extends EntityCrudController<ItemSubCategory>(
  options,
) {
  constructor(private readonly itemSubCategoryService: ItemSubCategoryService) {
    super(itemSubCategoryService);
  }

  @Get('parent/:parentCategory')
  async getItemsByParentCategory(
    @Param('parentCategory') parentCategory: string,
  ) {
    return await this.itemSubCategoryService.getItemsByParentCategory(
      parentCategory,
    );
  }
}

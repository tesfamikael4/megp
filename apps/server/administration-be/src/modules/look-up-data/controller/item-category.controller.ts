import { Get, Controller, Query } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse, DataResponseFormat } from 'src/shared/api-data';
import {
  CreateItemCategoryDto,
  ItemCategoryResponseDto,
  UpdateItemCategoryDto,
} from '../dto/item-category.dto';
import { ItemCategoryService } from '../service/item-category.service';
import { ItemCategory } from 'src/entities/item-category.entity';
import { EntityCrudController } from 'src/shared/controller';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { CollectionQuery } from 'src/shared/collection-query';
const options: EntityCrudOptions = {
  createDto: CreateItemCategoryDto,
  updateDto: UpdateItemCategoryDto,
};
@Controller('item-Categories')
@ApiTags('item Categories')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class ItemCategoriesController extends EntityCrudController<ItemCategory>(
  options,
) {
  constructor(private readonly itemCategoryService: ItemCategoryService) {
    super(itemCategoryService);
  }
  @Get('get-trees')
  @ApiPaginatedResponse(ItemCategoryResponseDto)
  async findAllCateAndSubCat(@Query() query: CollectionQuery) {
    return await this.itemCategoryService.findAllCateAndSubCat(query);
  }
}

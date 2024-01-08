import { Get, Controller, Query, Post, Body } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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
import {
  CollectionQuery,
  decodeCollectionQuery,
} from 'src/shared/collection-query';
const options: EntityCrudOptions = {
  createDto: CreateItemCategoryDto,
  updateDto: UpdateItemCategoryDto,
};
@Controller('item-categories')
@ApiTags('item categories')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class ItemCategoriesController extends EntityCrudController<ItemCategory>(
  options,
) {
  constructor(private readonly itemCategoryService: ItemCategoryService) {
    super(itemCategoryService);
  }
  @Post()
  async createUniqueData(@Body() itemCatDto: CreateItemCategoryDto) {
    return await this.itemCategoryService.createUniqueData(itemCatDto);
  }
  @Get()
  @ApiQuery({
    name: 'q',
    type: String,
    required: false,
  })
  @ApiPaginatedResponse(ItemCategoryResponseDto)
  async findAllCateAndSubCat(@Query('q') q: string) {
    const query = decodeCollectionQuery(q);
    console.log(query);
    return await this.itemCategoryService.findItems(query);
  }
}

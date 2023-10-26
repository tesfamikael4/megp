import {
  Body,
  Get,
  Controller,
  Post,
  Query,
  Delete,
  Param,
  ParseUUIDPipe,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse, DataResponseFormat } from 'src/shared/api-data';
import {
  CreateItemCategoryDto,
  ItemCategoryResponseDto,
  UpdateItemCategoryDto,
} from '../dto/item-category.dto';
import { ItemCategoryService } from '../service/item-category.service';
import { CollectionQuery } from 'src/shared/collection-query';
import { EntityCrudController } from 'src/shared/controller/entity-crud.controller';
import { ItemCategory } from 'src/entities/item-category.entity';

@Controller('item-Categories')
@ApiTags('item Categories')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class ItemCategoriesController extends EntityCrudController<ItemCategory> {
  constructor(private readonly itemCategoryService: ItemCategoryService) {
    super(itemCategoryService);
  }
  @Get('get-trees')
  @ApiPaginatedResponse(ItemCategoryResponseDto)
  async findAllCateAndSubCat(@Query() query: CollectionQuery) {
    return await this.itemCategoryService.findAllCateAndSubCat(query);
  }
}

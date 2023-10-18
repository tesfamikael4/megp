import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Param,
  Patch,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse, DataResponseFormat } from '@api-data';
import { CollectionQuery } from '@collection-query';
import { CategoryService } from './category.service';
import {
  CategoryResponseDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto/category.dto';

import { EntityCrudController } from 'src/shared/controller';
import { Category } from './entities/category';

@Controller('Categories')
@ApiTags('Categories')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class CategoriesController extends EntityCrudController<Category> {
  constructor(private readonly categoryService: CategoryService) {
    super(categoryService);
  }
  @Post()
  async create(@Body() dto: CreateCategoryDto) {
    return await super.create(dto);
  }

  @Get(':id')
  async findOne(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ) {
    return await super.findOne(id);
  }

  @Get()
  @ApiPaginatedResponse(CategoryResponseDto)
  async findAll(@Query() query: CollectionQuery) {
    return await super.findAll(query);
  }
  @Patch(':id')
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() updateDto: UpdateCategoryDto,
  ) {
    return await super.update(id, updateDto);
  }
}

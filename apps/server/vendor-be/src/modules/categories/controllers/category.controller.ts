import {
  Body,
  Controller,
  Post,
  Param,
  Patch,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse, DataResponseFormat } from '@api-data';
import { CollectionQuery } from '@collection-query';
import { CategoryService } from '../services/category.service';
import {
  CategoryResponseDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../dto/category.dto';
import { EntityCrudController } from 'src/shared/controller';
import { Category } from 'src/entities/category.entity';
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

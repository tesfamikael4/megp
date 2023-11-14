import {
  Body,
  Controller,
  Post,
  Param,
  Patch,
  HttpStatus,
  ParseUUIDPipe,
  UseGuards,
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
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { JwtGuard } from 'src/shared/authorization';
const options: EntityCrudOptions = {
  createDto: CreateCategoryDto,
  updateDto: UpdateCategoryDto,
};
@ApiBearerAuth()
@Controller('Categories')
@ApiTags('Categories')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class CategoriesController extends EntityCrudController<Category>(
  options,
) {
  constructor(private readonly categoryService: CategoryService) {
    super(categoryService);
  }
  @UseGuards(JwtGuard)
  @Post()
  async create(@Body() dto: CreateCategoryDto) {
    return await super.create(dto);
  }
  @UseGuards(JwtGuard)
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

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
import { RegistrationTypes } from 'src/shared/enums/vendor-enums';
//@ApiBearerAuth()
@Controller('Categories')
@ApiTags('Categories')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class CategoriesController {
  constructor(private readonly categoryService: CategoryService) {}
  @Post('create-category')
  async create(@Body() dto: CreateCategoryDto) {
    return await this.categoryService.create(dto);
  }

  @Get('get-category-by-id/:id')
  async findOne(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ) {
    return await this.categoryService.findOne(id);
  }

  @Get('get-all-categories')
  @ApiPaginatedResponse(CategoryResponseDto)
  // @ApiOkResponse({ type: Todo, isArray: false })
  async findAll(@Query() query: CollectionQuery) {
    return await this.categoryService.findAll(query);
  }

  @Patch('update-category/:id')
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() updateDto: UpdateCategoryDto,
  ) {
    return await this.categoryService.update(id, updateDto);
  }

  @Delete('delete-category/:id')
  @ApiOkResponse({ type: String })
  async remove(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ) {
    await this.categoryService.remove(id);
    return 'success';
  }
  @Post('restore-category/:id')
  @ApiPaginatedResponse(CategoryResponseDto)
  async restore(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ) {
    const result = await this.categoryService.restore(id);
    return result;
  }
  // Archiving service Provider
  @Delete('archive-category/:id')
  @ApiPaginatedResponse(Boolean)
  async softDelete(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    // user: UserInfo
  ) {
    return await this.categoryService.softDelete(id);
  }

  @Get('get-archived-categories')
  @ApiPaginatedResponse(CategoryResponseDto)
  async getArchivedCategories(@Query() query: CollectionQuery) {
    return this.categoryService.getArchivedCategories(query);
  }

  @Get('get-registration-types')
  @ApiOkResponse()
  async getRegistrationTypes() {
    console.log(RegistrationTypes.New);
    const array = Object.entries(RegistrationTypes).map((entry) => {
      const [key, value] = entry;
      return {
        key,
        value,
      };
    });
    return array;
  }

  //child methods
}

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductCatalogsService } from '../services/product-catalog.service';
import {
  ApiExtraModels,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { DataResponseFormat } from '@api-data';
import { ProductCatalog } from '@entities';
import { EntityCrudController } from '@generic-controllers';
import { AllowAnonymous, ApiKeyGuard } from 'src/shared/authorization';
import { ProductCatalogApprovalStatus } from 'src/shared/enums/product-catalog-enum';
import { decodeCollectionQuery } from 'src/shared/collection-query';

const options: EntityCrudOptions = {};
@Controller('product-catalogs')
@ApiTags('product-catalogs')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class ProductCatalogsController extends EntityCrudController<ProductCatalog>(
  options,
) {
  constructor(private readonly productCatalogService: ProductCatalogsService) {
    super(productCatalogService);
  }

  @Get('/:vendorId')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  getById(@Param('vendorId') vendorId: string, @Query('q') q: string) {
    const query = decodeCollectionQuery(q);
    return this.productCatalogService.getById(vendorId, query);
  }
  approveCatalog(
    id: string,
    approvalStatus: ProductCatalogApprovalStatus,
    req?: any,
  ) {
    return this.productCatalogService.approveCatalog(id, approvalStatus, req);
  }

  @Get('with-images/:id')
  async getWithImage(@Param('id') id?: string) {
    return await this.productCatalogService.getWithImage(id);
  }

  @Get('with-images')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  async getWithImages(@Query('q') q?: string) {
    const query = decodeCollectionQuery(q);
    return await this.productCatalogService.getWithImages(query);
  }

  //for Market place
  @Post('details')
  @AllowAnonymous()
  @UseGuards(ApiKeyGuard)
  async getDetails(@Body() ids: string[]) {
    return await this.productCatalogService.getDetails(ids);
  }
}

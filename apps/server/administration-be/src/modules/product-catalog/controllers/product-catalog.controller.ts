import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ProductCatalogsService } from '../services/product-catalog.service';
import {
  ApiExtraModels,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { DataResponseFormat } from '@api-data';
import { ProductCatalog } from '@entities';
import { EntityCrudController } from '@generic-controllers';
import { AllowAnonymous, ApiKeyGuard } from 'src/shared/authorization';
import { ProductCatalogApprovalStatus } from 'src/shared/enums/product-catalog-enum';

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


  approveCatalog(id: string, approvalStatus: ProductCatalogApprovalStatus, req?: any) {
    return this.productCatalogService.approveCatalog(id, approvalStatus, req);
  }
  //for Market place

  @Post('details')
  @AllowAnonymous()
  @UseGuards(ApiKeyGuard)
  async getDetails(@Body() ids: string[]) {
    return await this.productCatalogService.getDetails(ids);
  }
}

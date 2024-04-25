import { Controller } from '@nestjs/common';
import { ProductCatalogsService } from '../services/product-catalog.service';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { DataResponseFormat } from '@api-data';
import { ProductCatalog } from '@entities';
import { EntityCrudController } from '@generic-controllers';

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
}

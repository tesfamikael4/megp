import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller/extra-crud.controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ProductCatalogDelivery } from 'src/entities';
import {
  CreateProductCatalogDeliveryDto,
  UpdateProductCatalogDeliveryDto,
} from '../dto/product-catalog-delivery.dto';
import { ProductCatalogDeliveryService } from '../services/product-catalog-delivery.service';

const options: ExtraCrudOptions = {
  entityIdName: 'productCatalogId',
  createDto: CreateProductCatalogDeliveryDto,
  updateDto: UpdateProductCatalogDeliveryDto,
};

@Controller('product-catalog-deliveries')
@ApiTags('product-catalog-deliveries')
export class ProductCatalogDeliveryController extends ExtraCrudController<ProductCatalogDelivery>(
  options,
) {
  constructor(
    private readonly productCatalogDeliveryService: ProductCatalogDeliveryService,
  ) {
    super(productCatalogDeliveryService);
  }
}

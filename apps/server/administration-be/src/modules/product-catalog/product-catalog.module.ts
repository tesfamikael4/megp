import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ProductCatalog,
  ProductCatalogDelivery,
  ProductCatalogImage,
  SpecificationTemplate,
} from 'src/entities';
import { ProductCatalogsController } from './controllers/product-catalog.controller';
import { ProductCatalogsService } from './services/product-catalog.service';
import { SpecificationTemplatesController } from './controllers/specification-template.controller';
import { SpecificationTemplatesService } from './services/specification-template.service';
import { ProductCatalogImageService } from './services/product-catalog-image.service';
import { MinIOModule } from 'src/shared/min-io';
import { ProductCatalogImageController } from './controllers/product-catalog-image.controller';
import { ItemMasterModule } from '../item-master/item-master.module';
import { ProductCatalogDeliveryService } from './services/product-catalog-delivery.service';
import { ProductCatalogDeliveryController } from './controllers/product-catalog-delivery.controller';

@Module({
  imports: [
    MinIOModule,
    ItemMasterModule,
    TypeOrmModule.forFeature([
      ProductCatalog,
      SpecificationTemplate,
      ProductCatalogImage,
      ProductCatalogDelivery,
    ]),
  ],
  controllers: [
    ProductCatalogsController,
    SpecificationTemplatesController,
    ProductCatalogImageController,
    ProductCatalogDeliveryController,
  ],
  providers: [
    ProductCatalogsService,
    SpecificationTemplatesService,
    ProductCatalogImageService,
    ProductCatalogDeliveryService,
  ],
})
export class ProductCatalogModule {}

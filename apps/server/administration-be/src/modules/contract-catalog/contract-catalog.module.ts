import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ContractAllocatedItem,
  ContractBeneficiary,
  ContractCatalog,
  ContractItem,
  ContractItemPrice,
  ProductCatalog,
} from 'src/entities';
import { ContractCatalogsService } from './services/contract-catalog.service';
import { ContractCatalogsController } from './controllers/contract-catalog.controller';
import { ContractItemController } from './controllers/contract-item.controller';
import { ContractAllocatedItemController } from './controllers/contract-allocated-item.controller';
import { ContractItemPriceController } from './controllers/contract-item-price.controller';
import { ContractBeneficiaryController } from './controllers/contract-beneficiary.controller';
import { ContractAllocatedItemsService } from './services/contarct-allocated-item.service';
import { ContractBeneficiariesService } from './services/contract-beneficiary.service';
import { ContractItemPricesService } from './services/contract-item-price.service';
import { ContractItemsService } from './services/contract-item.service';
import { ProductCatalogsService } from '../product-catalog/services/product-catalog.service';
import { MinIOModule } from 'src/shared/min-io';

@Module({
  imports: [
    MinIOModule,
    TypeOrmModule.forFeature([
      ContractCatalog,
      ContractItem,
      ContractItemPrice,
      ContractAllocatedItem,
      ContractBeneficiary,
      ProductCatalog
    ]),
  ],
  controllers: [
    ContractCatalogsController,
    ContractItemController,
    ContractItemPriceController,
    ContractAllocatedItemController,
    ContractBeneficiaryController,
  ],
  providers: [
    ContractCatalogsService,
    ContractItemsService,
    ContractItemPricesService,
    ContractAllocatedItemsService,
    ContractBeneficiariesService,
    ProductCatalogsService,
  ],
})
export class ContractCatalogModule { }

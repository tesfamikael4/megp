import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service/extra-crud.service';
import { ProductCatalogDelivery } from 'src/entities';
import { MinIOService } from 'src/shared/min-io';

@Injectable()
export class ProductCatalogDeliveryService extends ExtraCrudService<ProductCatalogDelivery> {
  constructor(
    @InjectRepository(ProductCatalogDelivery)
    private readonly repositoryProductCatalogDelivery: Repository<ProductCatalogDelivery>,
    private readonly minIOService: MinIOService,
  ) {
    super(repositoryProductCatalogDelivery);
  }
}

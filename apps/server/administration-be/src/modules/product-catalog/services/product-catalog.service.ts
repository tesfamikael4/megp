import { Injectable } from '@nestjs/common';
import { ProductCatalog } from '@entities';
import { EntityCrudService } from '@generic-services';
import { InjectRepository } from '@nestjs/typeorm';
import { In } from 'typeorm';
import { Repository } from 'typeorm';
import {
  ProductCatalogData,
  ProductCatalogSchema,
} from '../dto/product-catalog.dto';
import { FetchMarketplaceProductsDto } from '../dto/marketplace-products.dto';
@Injectable()
export class ProductCatalogsService extends EntityCrudService<ProductCatalog> {
  constructor(
    @InjectRepository(ProductCatalog)
    private readonly productCatalogRepository: Repository<ProductCatalog>,
  ) {
    super(productCatalogRepository);
  }
  async create(data: ProductCatalogData, req?: any): Promise<any> {
    if (req?.user?.organization) {
      data.vendor = req?.user?.organization;
    }
    ProductCatalogSchema.parse(data);
    const productCatalog = this.productCatalogRepository.create(data);
    return await this.productCatalogRepository.save(productCatalog);
  }
  update(id: string, data: any): Promise<ProductCatalog> {
    ProductCatalogSchema.parse(data);
    return this.productCatalogRepository.save({ id, ...data });
  }

  async getDetails(payload: FetchMarketplaceProductsDto) {
    return await this.productCatalogRepository.find({
      where: {
        id: In([payload.catalogIds]),
      },
    });
  }
}

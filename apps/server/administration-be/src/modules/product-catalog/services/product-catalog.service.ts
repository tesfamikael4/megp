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
import { ProductCatalogApprovalStatus } from 'src/shared/enums/product-catalog-enum';
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


  approveCatalog(id: string, approvalStatus: ProductCatalogApprovalStatus, req?: any) {
    if (req?.user?.organization) {
      return this.productCatalogRepository.save({
        id,
        approvalStatus,
        approver: {
          id: req?.user?.id,
          name: req?.user?.name,
        },
      });
    }
  } 
  async getDetails(ids: string[]) {
    return await this.productCatalogRepository.find({
      where: {
        id: In([ids]),
      },
    });
  }
}

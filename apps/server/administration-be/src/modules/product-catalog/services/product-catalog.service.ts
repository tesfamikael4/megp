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
import { MinIOService } from 'src/shared/min-io';
import { CollectionQuery } from 'src/shared/collection-query';
@Injectable()
export class ProductCatalogsService extends EntityCrudService<ProductCatalog> {
  constructor(
    @InjectRepository(ProductCatalog)
    private readonly productCatalogRepository: Repository<ProductCatalog>,
    private readonly minIOService: MinIOService,
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

  async getWithImage(id: string) {

    const data = await this.productCatalogRepository.findOne({
      where: { id }, relations:
      {
        productCatalogImages: true
      }
    });

    const { productCatalogImages } = data;
    let presignedUrl = null;
    if (productCatalogImages.length > 0) {
      try {
        presignedUrl = await Promise.all(productCatalogImages.map(async image => {
          return await this.minIOService.generatePresignedDownloadUrl(image.fileInfo);
        }))
      } catch (error) {
        console.error('Failed to download image:', error);
      }
    }
    const response = {
      item: data,
      presignedUrl
    }

    return response;
  }

  async getWithImages(query: CollectionQuery) {
    query.includes = ['productCatalogImages'];

    const data = await this.findAll(query);

    const enhancedData = await Promise.all(data.items.map(async item => {
      let presignedUrl = null;

      if (item.productCatalogImages.length > 0) {
        const [firstImage] = item.productCatalogImages;
        try {
          presignedUrl = await this.minIOService.generatePresignedDownloadUrl(firstImage.fileInfo);
        } catch (error) {
          console.error('Failed to download image:', error);
        }
      }
      return {
        ...item,
        presignedUrl
      };
    }));
    const response = {
      items: enhancedData,
      count: data.total
    }

    return response;
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
        id: In(ids),
      },
    });
  }
}

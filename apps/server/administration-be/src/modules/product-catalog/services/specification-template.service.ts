import { Injectable } from '@nestjs/common';
import { SpecificationTemplate } from '@entities';
import { EntityCrudService } from '@generic-services';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  SpecificationTemplateData,
  SpecificationTemplateSchema,
} from '../dto/specification-template.dto';
@Injectable()
export class SpecificationTemplatesService extends EntityCrudService<SpecificationTemplate> {
  constructor(
    @InjectRepository(SpecificationTemplate)
    private readonly productCatalogRepository: Repository<SpecificationTemplate>,
  ) {
    super(productCatalogRepository);
  }
  async copy(data: any, req: any): Promise<any> {
    const template = await this.productCatalogRepository.findOne({
      where: { itemMasterId: data.itemMasterId },
    });
    delete template.id;
    template.quantity = parseFloat(template.quantity.toString());
    template.itemMasterId = data.newItemMasterId;
    return await this.create(template, req);
  }
  async getByItem(itemMasterId: any): Promise<any> {
    return await this.productCatalogRepository.findOne({
      where: { itemMasterId },
    });
  }

  async create(data: SpecificationTemplateData, req: any): Promise<any> {
    SpecificationTemplateSchema.parse(data);
    if (req.user?.organization) {
      data.organizationId = req.user.organization.id;
      data.organizationName = req.user.organization.name;
    }
    const productCatalog = this.productCatalogRepository.create(data);
    return await this.productCatalogRepository.save(productCatalog);
  }
  update(id: string, data: any): Promise<SpecificationTemplate> {
    SpecificationTemplateSchema.parse(data);
    return this.productCatalogRepository.save({ id, ...data });
  }
}

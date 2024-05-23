import { Injectable } from '@nestjs/common';
import { SpecificationTemplate } from '@entities';
import { EntityCrudService } from '@generic-services';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  SpecificationTemplateData,
  SpecificationTemplateSchema,
} from '../dto/specification-template.dto';
import { CollectionQuery, FilterOperators } from 'src/shared/collection-query';
import { ItemMasterService } from 'src/modules/item-master/services/item-master.service';
@Injectable()
export class SpecificationTemplatesService extends EntityCrudService<SpecificationTemplate> {
  constructor(
    @InjectRepository(SpecificationTemplate)
    private readonly specificationTemplateRepository: Repository<SpecificationTemplate>,

    private readonly itemMasterRepository: ItemMasterService,
  ) {
    super(specificationTemplateRepository);
  }
  async copy(data: any, req: any): Promise<any> {
    const template = await this.specificationTemplateRepository.findOne({
      where: { itemMasterId: data.itemMasterId },
    });
    delete template.id;
    template.quantity = parseFloat(template.quantity.toString());
    template.itemMasterId = data.newItemMasterId;
    return await this.create(template, req);
  }
  async getItems(status: string, query: CollectionQuery): Promise<any> {
    const ids = await this.specificationTemplateRepository.find({
      select: ['itemMasterId'],
    });
    const flatIds = ids.map((id) => id.itemMasterId);
    if (flatIds.length > 0) {
      const filterOperator =
        status === 'used'
          ? FilterOperators.In
          : status === 'unused'
            ? FilterOperators.NotIn
            : null;
      if (filterOperator) {
        query.where.push([
          {
            column: 'id',
            value: flatIds,
            operator: filterOperator,
          },
        ]);
      }
    } //else return all items

    return await this.itemMasterRepository.findAll(query);
  }
  async getByItem(itemMasterId: any): Promise<any> {
    return await this.specificationTemplateRepository.findOne({
      where: { itemMasterId },
    });
  }

  async getByItemCode(itemMasterCode: any): Promise<any> {
    return await this.specificationTemplateRepository.findOne({
      where: { itemMasterCode },
    });
  }

  async create(data: SpecificationTemplateData, req: any): Promise<any> {
    SpecificationTemplateSchema.parse(data);
    if (req.user?.organization) {
      data.organizationId = req.user.organization.id;
      data.organizationName = req.user.organization.name;
    }
    const productCatalog = this.specificationTemplateRepository.create(data);
    return await this.specificationTemplateRepository.save(productCatalog);
  }
  update(id: string, data: any): Promise<SpecificationTemplate> {
    SpecificationTemplateSchema.parse(data);
    return this.specificationTemplateRepository.save({ id, ...data });
  }
}

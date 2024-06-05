import { Injectable } from '@nestjs/common';
import { ContractCatalog } from '@entities';
import { EntityCrudService } from '@generic-services';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollectionQuery, FilterOperators } from 'src/shared/collection-query';

@Injectable()
export class ContractCatalogsService extends EntityCrudService<ContractCatalog> {
  constructor(
    @InjectRepository(ContractCatalog)
    private readonly contractCatalogRepository: Repository<ContractCatalog>,
  ) {
    super(contractCatalogRepository);
  }
  async findAll(query: CollectionQuery, req?: any): Promise<any> {
    query.where.push([
      {
        column: 'vendor.organization.id',
        value: req.user.organization.id,
        operator: FilterOperators.EqualTo,
      },
    ]);
    return await this.contractCatalogRepository.find({});
  }
  async create(data: any, req?: any): Promise<any> {
    if (req?.user?.organization) {
      data.organization = req.user.organization;
    }
    const contractCatalog = this.contractCatalogRepository.create(data);
    return await this.contractCatalogRepository.save(contractCatalog);
  }
  update(id: string, data: any): Promise<ContractCatalog> {
    return this.contractCatalogRepository.save({ id, ...data });
  }
}

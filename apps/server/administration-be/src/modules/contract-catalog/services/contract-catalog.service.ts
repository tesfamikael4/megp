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
}

import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Application } from '@entities';
import { EntityCrudService } from 'src/shared/service/entity-crud.service';
import { CollectionQuery, QueryConstructor } from 'src/shared/collection-query';
import { DataResponseFormat } from 'src/shared/api-data';

@Injectable()
export class ApplicationService extends EntityCrudService<Application> {
  constructor(
    @InjectRepository(Application)
    private readonly repositoryApplication: Repository<Application>,
  ) {
    super(repositoryApplication);
  }

  async findUnderOrganization(organizationId: string, query: CollectionQuery) {
    const dataQuery = QueryConstructor.constructQuery<Application>(
      this.repositoryApplication,
      query,
    )
      .innerJoin('applications.permissions', 'permissions')
      .innerJoin('permissions.mandatePermissions', 'mandatePermissions')
      .innerJoin('mandatePermissions.mandate', 'mandate')
      .innerJoin('mandate.organizationMandates', 'organizationMandates')
      .andWhere('organizationMandates.organizationId =:organizationId', {
        organizationId,
      });

    const response = new DataResponseFormat<Application>();

    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [items, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = items;
    }

    return response;
  }
}

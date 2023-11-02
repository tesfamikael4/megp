import { EntityCrudService } from 'src/shared/service/entity-crud.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { QueryConstructorNew } from 'src/shared/collection-query/query-constructor-new';
import { DataResponseFormat } from 'src/shared/api-data';
import { CollectionQueryNew } from 'src/shared/collection-query/query';
import { OrganizationType } from '@entities';

@Injectable()
export class OrganizationTypeService extends EntityCrudService<OrganizationType> {
  constructor(
    @InjectRepository(OrganizationType)
    private readonly groupRepository: Repository<OrganizationType>,
  ) {
    super(groupRepository);
  }

  async getAllOrganizationTypes(query: CollectionQueryNew) {
    try {
      const dataQuery = QueryConstructorNew.constructQuery<OrganizationType>(
        this.groupRepository,
        query,
      );

      const response = new DataResponseFormat<OrganizationType>();

      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;

      return response;
    } catch (error) {
      console.log(
        '🚀 ~ file: group.service.ts:32 ~ OrganizationTypeService ~ getAllOrganizationTypes ~ error:',
        error,
      );
    }
  }
}

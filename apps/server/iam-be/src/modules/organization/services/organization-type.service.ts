import { EntityCrudService } from 'src/shared/service/entity-crud.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DataResponseFormat } from 'src/shared/api-data';
import { OrganizationType } from '@entities';
import { QueryConstructor, CollectionQuery } from 'src/shared/collection-query';

@Injectable()
export class OrganizationTypeService extends EntityCrudService<OrganizationType> {
  constructor(
    @InjectRepository(OrganizationType)
    private readonly groupRepository: Repository<OrganizationType>,
  ) {
    super(groupRepository);
  }

  async getAllOrganizationTypes(query: CollectionQuery) {
    try {
      const dataQuery = QueryConstructor.constructQuery<OrganizationType>(
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

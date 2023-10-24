import { EntityCrudService } from 'src/shared/service/entity-crud.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { QueryConstructorNew } from 'src/shared/collection-query/query-constructor-new';
import { DataResponseFormat } from 'src/shared/api-data';
import { CollectionQueryNew } from 'src/shared/collection-query/query';
import { OrganizationSector } from '../entities/organization-sector.entity';

@Injectable()
export class OrganizationSectorService extends EntityCrudService<OrganizationSector> {
  constructor(
    @InjectRepository(OrganizationSector)
    private readonly groupRepository: Repository<OrganizationSector>,
  ) {
    super(groupRepository);
  }

  async getAllOrganizationSectors(query: CollectionQueryNew) {
    try {
      const dataQuery = QueryConstructorNew.constructQuery<OrganizationSector>(
        this.groupRepository,
        query,
      );

      const response = new DataResponseFormat<OrganizationSector>();

      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;

      return response;
    } catch (error) {
      console.log(
        '🚀 ~ file: group.service.ts:32 ~ OrganizationSectorService ~ getAllOrganizationSectors ~ error:',
        error,
      );
    }
  }
}

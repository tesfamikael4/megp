import { EntityCrudService } from 'src/shared/service/entity-crud.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DataResponseFormat } from 'src/shared/api-data';
import { CollectionQuery, QueryConstructor } from 'src/shared/collection-query';
import { OrganizationSector } from '@entities';

@Injectable()
export class OrganizationSectorService extends EntityCrudService<OrganizationSector> {
  constructor(
    @InjectRepository(OrganizationSector)
    private readonly groupRepository: Repository<OrganizationSector>,
  ) {
    super(groupRepository);
  }

  async getAllOrganizationSectors(query: CollectionQuery) {
    try {
      const dataQuery = QueryConstructor.constructQuery<OrganizationSector>(
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

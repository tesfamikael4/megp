import { EntityCrudService } from 'src/shared/service/entity-crud.service';
import { Group } from '@entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DataResponseFormat } from 'src/shared/api-data';
import { CollectionQuery, QueryConstructor } from 'src/shared/collection-query';

@Injectable()
export class GroupService extends EntityCrudService<Group> {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {
    super(groupRepository);
  }

  async getAllGroups(query: CollectionQuery) {
    try {
      const dataQuery = QueryConstructor.constructQuery<Group>(
        this.groupRepository,
        query,
      );

      const response = new DataResponseFormat<Group>();

      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;

      return response;
    } catch (error) {
      throw error;
    }
  }
}

import { EntityCrudService } from 'src/shared/service/entity-crud.service';
import { Group } from '@entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { QueryConstructorNew } from 'src/shared/collection-query/query-constructor-new';
import { DataResponseFormat } from 'src/shared/api-data';
import { CollectionQueryNew } from 'src/shared/collection-query/query';

@Injectable()
export class GroupService extends EntityCrudService<Group> {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {
    super(groupRepository);
  }

  async getAllGroups(query: CollectionQueryNew) {
    try {
      const dataQuery = QueryConstructorNew.constructQuery<Group>(
        this.groupRepository,
        query,
      );

      const response = new DataResponseFormat<Group>();

      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;

      return response;
    } catch (error) {
      console.log(
        '🚀 ~ file: group.service.ts:32 ~ GroupService ~ getAllGroups ~ error:',
        error,
      );
    }
  }
}

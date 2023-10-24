import { EntityCrudService } from 'src/shared/service/entity-crud.service';
import { Group } from '../entity/group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  async create(itemData: Group, req?: any): Promise<Group> {
    const item = this.groupRepository.create(itemData);
    await this.groupRepository.save(item);
    const item1 = this.groupRepository.create(itemData);
    await this.groupRepository.save(item1);
    const item2 = this.groupRepository.create(itemData);
    await this.groupRepository.save(item2);
    throw new HttpException('fail', HttpStatus.BAD_REQUEST);
    const item3 = this.groupRepository.create(itemData);
    await this.groupRepository.save(item3);
    return await this.groupRepository.save(item);
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

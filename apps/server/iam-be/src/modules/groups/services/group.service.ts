import { EntityCrudService } from 'src/shared/service/entity-crud.service';
import { Group } from '@entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataResponseFormat } from 'src/shared/api-data';
import { CollectionQuery, QueryConstructor } from 'src/shared/collection-query';
import { ExtraCrudService } from 'src/shared/service';

@Injectable()
export class GroupService extends ExtraCrudService<Group> {
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

  async softDelete(id: string, req?: any): Promise<void> {
    const item = await this.groupRepository.findOne({
      where: {
        id,
      },
      relations: {
        userGroups: true,
      },
      select: {
        id: true,
      },
    });

    if (!item) throw new NotFoundException(`not_found`);

    if (item.userGroups.length > 0) {
      throw new BadRequestException(`cant_delete_user_group_with_users`);
    }
    await this.groupRepository.softRemove(item);
  }
}

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserGroup } from '../entity/user-group.entity';
import { RelationCrudService } from 'src/shared/service/relation-crud.service';

@Injectable()
export class UserGroupBulkService extends RelationCrudService<UserGroup> {
  constructor(
    @InjectRepository(UserGroup)
    private readonly groupRepository: Repository<UserGroup>,
  ) {
    super(groupRepository);
  }
}

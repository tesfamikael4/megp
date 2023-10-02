import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserGroup } from '../entity/user-group.entity';
import { GenericRelationCrudService } from 'src/shared/service/generic-relation-crud.service';

@Injectable()
export class UserGroupRelationService extends GenericRelationCrudService<UserGroup> {
  constructor(
    @InjectRepository(UserGroup)
    private readonly groupRepository: Repository<UserGroup>,
  ) {
    super(groupRepository);
  }
}

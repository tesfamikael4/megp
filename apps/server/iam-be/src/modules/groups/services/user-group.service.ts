import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserGroup } from '@entities';
import { RelationCrudService } from 'src/shared/service';

@Injectable()
export class UserGroupService extends RelationCrudService<UserGroup> {
  constructor(
    @InjectRepository(UserGroup)
    private readonly groupRepository: Repository<UserGroup>,
  ) {
    super(groupRepository);
  }
}

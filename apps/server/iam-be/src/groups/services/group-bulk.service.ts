import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserGroup } from '../entity/user-group.entity';
import { GenericBulkCrudService } from 'src/shared/service/generic-bulk-crud.service';

@Injectable()
export class UserGroupBulkService extends GenericBulkCrudService<UserGroup> {
  constructor(
    @InjectRepository(UserGroup)
    private readonly groupRepository: Repository<UserGroup>,
  ) {
    super(groupRepository);
  }
}

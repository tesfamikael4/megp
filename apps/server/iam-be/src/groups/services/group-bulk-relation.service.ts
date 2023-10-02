import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserGroup } from '../entity/user-group.entity';
import { ExtraCrudService } from 'src/shared/service/extra-crud.service';

@Injectable()
export class UserGroupRelationService extends ExtraCrudService<UserGroup> {
  constructor(
    @InjectRepository(UserGroup)
    private readonly groupRepository: Repository<UserGroup>,
  ) {
    super(groupRepository);
  }
}

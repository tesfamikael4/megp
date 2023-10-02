import { EntityCrudService } from 'src/shared/service/entity-crud.service';
import { Group } from '../entity/group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GroupService extends EntityCrudService<Group> {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {
    super(groupRepository);
  }
}

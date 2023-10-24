import { EntityCrudController } from 'src/shared/controller/entity-crud.controller';
import { Group } from '../entity/group.entity';
import { GroupService } from '../services/group.service';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('groups')
@ApiTags('groups')
export class GroupController extends EntityCrudController<Group> {
  constructor(private readonly groupService: GroupService) {
    super(groupService);
  }
}

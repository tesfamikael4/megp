import { EntityCrudController } from 'src/shared/controller/entity-crud.controller';
import { Group } from '@entities';
import { GroupService } from '../services/group.service';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateGroupDto, UpdateGroupDto } from '../dto/group.dto';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';

const options: EntityCrudOptions = {
  createDto: CreateGroupDto,
  updateDto: UpdateGroupDto,
};

@Controller('groups')
@ApiTags('groups')
export class GroupController extends EntityCrudController<Group>(options) {
  constructor(private readonly groupService: GroupService) {
    super(groupService);
  }
}

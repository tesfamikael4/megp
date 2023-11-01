import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserGroup } from '../entity/user-group.entity';
import { UserGroupService } from '../services/user-group.service';
import { RelationCrudDecorator } from 'src/shared/decorators/crud-options.decorator';
import { RelationCrudController } from 'src/shared/controller';
import { AssignGroupDto, AssignUserDto } from '../dto/user-group.dto';
import { RelationCrudOptions } from 'src/shared/types/crud-option.type';

const options: RelationCrudOptions = {
  firstEntityIdName: 'userId',
  firstInclude: 'group',
  secondEntityIdName: 'groupId',
  secondInclude: 'user',
  assignFirstDto: AssignGroupDto,
  assignSecondDto: AssignUserDto,
};

@Controller('user-groups')
@ApiTags('user-groups')
export class UserGroupNewController extends RelationCrudController<UserGroup>(
  options,
) {
  constructor(private readonly permissionService: UserGroupService) {
    super(permissionService);
  }
}

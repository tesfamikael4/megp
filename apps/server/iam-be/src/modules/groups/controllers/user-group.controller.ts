import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserGroup } from '../entity/user-group.entity';
import { UserGroupService } from '../services/user-group.service';
import { RelationCrudDecorator } from 'src/shared/decorators/crud-options.decorator';
import { RelationCrudController } from 'src/shared/controller';
@RelationCrudDecorator({
  firstEntityIdName: 'userId',
  firstInclude: 'group',
  secondEntityIdName: 'groupId',
  secondInclude: 'user',
})
@Controller('user-groups')
@ApiTags('user-groups')
export class UserGroupNewController extends RelationCrudController<UserGroup>() {
  constructor(private readonly permissionService: UserGroupService) {
    super(permissionService);
  }
}

import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserRole } from '../entities/user-role.entity';
import { UserRoleService } from '../services/user-role.service';
import { RelationCrudController } from 'src/shared/controller/relation-crud.controller';
import { RelationCrudDecorator } from 'src/shared/decorators/crud-options.decorator';
@RelationCrudDecorator({
  firstEntityIdName: 'roleId',
  firstInclude: 'user',
  secondEntityIdName: 'userId',
  secondInclude: 'role',
})
@Controller('user-role')
@ApiTags('user-role')
export class UserRoleController extends RelationCrudController<UserRole>(
  'user',
  'role',
) {
  constructor(private readonly userRoleService: UserRoleService) {
    super(userRoleService);
  }
}

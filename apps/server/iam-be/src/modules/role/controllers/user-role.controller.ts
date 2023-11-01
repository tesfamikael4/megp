import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserRole } from '../entities/user-role.entity';
import { UserRoleService } from '../services/user-role.service';
import { RelationCrudController } from 'src/shared/controller/relation-crud.controller';
import { RelationCrudOptions } from 'src/shared/types/crud-option.type';

const options: RelationCrudOptions = {
  firstEntityIdName: 'roleId',
  firstInclude: 'user',
  secondEntityIdName: 'userId',
  secondInclude: 'role',
  // assignFirstDto: CreatePermissionDto,
  // assignSecondDto: UpdatePermissionDto
};

@Controller('user-role')
@ApiTags('user-role')
export class UserRoleController extends RelationCrudController<UserRole>(
  options,
) {
  constructor(private readonly userRoleService: UserRoleService) {
    super(userRoleService);
  }
}

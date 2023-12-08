import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserRole } from '@entities';
import { UserRoleSystemService } from '../services/user-role-system.service';
import { RelationCrudController } from 'src/shared/controller/relation-crud.controller';
import { RelationCrudOptions } from 'src/shared/types/crud-option.type';
import { UserRoleSystem } from 'src/entities/user-role-system.entity';

const options: RelationCrudOptions = {
  firstEntityIdName: 'roleId',
  firstInclude: 'user',
  secondEntityIdName: 'userId',
  secondInclude: 'role',
  // assignFirstDto: CreatePermissionDto,
  // assignSecondDto: UpdatePermissionDto
};

@Controller('user-role-systems')
@ApiTags('user-role-systems')
export class UserRoleSystemController extends RelationCrudController<UserRoleSystem>(
  options,
) {
  constructor(private readonly userRoleService: UserRoleSystemService) {
    super(userRoleService);
  }
}

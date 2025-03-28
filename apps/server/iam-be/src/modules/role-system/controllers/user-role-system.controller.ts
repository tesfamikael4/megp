import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserRoleSystemService } from '../services/user-role-system.service';
import { RelationCrudController } from 'src/shared/controller/relation-crud.controller';
import { RelationCrudOptions } from 'src/shared/types/crud-option.type';
import { UserRoleSystem } from 'src/entities/user-role-system.entity';

const options: RelationCrudOptions = {
  firstEntityIdName: 'roleSystemId',
  firstInclude: 'user',
  secondEntityIdName: 'userId',
  secondInclude: 'roleSystem',
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

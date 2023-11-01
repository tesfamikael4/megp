import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RolePermission } from '../entities/role-permission.entity';
import { RolePermissionService } from '../services/role-permission.service';
import { RelationCrudController } from 'src/shared/controller/relation-crud.controller';
import { RelationCrudOptions } from 'src/shared/types/crud-option.type';

const options: RelationCrudOptions = {
  firstEntityIdName: 'roleId',
  firstInclude: 'permission',
  secondEntityIdName: 'permissionId',
  secondInclude: 'role',
  // assignFirstDto: CreatePermissionDto,
  // assignSecondDto: UpdatePermissionDto
};

@Controller('role-permissions')
@ApiTags('role-permissions')
export class RolePermissionNewController extends RelationCrudController<RolePermission>(
  options,
) {
  constructor(private readonly rolePermissionService: RolePermissionService) {
    super(rolePermissionService);
  }
}

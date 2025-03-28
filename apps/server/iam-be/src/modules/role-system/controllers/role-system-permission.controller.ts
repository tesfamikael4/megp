import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RolePermission } from '@entities';
import { RoleSystemPermissionService } from '../services/role-system-permission.service';
import { RelationCrudController } from 'src/shared/controller/relation-crud.controller';
import { RelationCrudOptions } from 'src/shared/types/crud-option.type';
import { RoleSystemPermission } from 'src/entities/role-system-permission.entity';

const options: RelationCrudOptions = {
  firstEntityIdName: 'roleSystemId',
  firstInclude: 'permission',
  secondEntityIdName: 'permissionId',
  secondInclude: 'roleSystem',
  // assignFirstDto: CreatePermissionDto,
  // assignSecondDto: UpdatePermissionDto
};

@Controller('role-system-permissions')
@ApiTags('role-system-permissions')
export class RoleSystemPermissionController extends RelationCrudController<RoleSystemPermission>(
  options,
) {
  constructor(
    private readonly rolePermissionService: RoleSystemPermissionService,
  ) {
    super(rolePermissionService);
  }
}

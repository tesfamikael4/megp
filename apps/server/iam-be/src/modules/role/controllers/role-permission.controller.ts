import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RolePermission } from '../entities/role-permission.entity';
import { RolePermissionService } from '../services/role-permission.service';
import { RelationCrudController } from 'src/shared/controller/relation-crud.controller';
import { RelationCrudDecorator } from 'src/shared/decorators/crud-options.decorator';
@RelationCrudDecorator({
  firstEntityIdName: 'roleId',
  firstInclude: 'permission',
  secondEntityIdName: 'permissionId',
  secondInclude: 'role',
})
@Controller('role-permissions')
@ApiTags('role-permissions')
export class RolePermissionNewController extends RelationCrudController<RolePermission>() {
  constructor(private readonly rolePermissionService: RolePermissionService) {
    super(rolePermissionService);
  }
}

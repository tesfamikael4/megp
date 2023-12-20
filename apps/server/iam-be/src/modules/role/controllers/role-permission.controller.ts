import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { RolePermission } from '@entities';
import { RolePermissionService } from '../services/role-permission.service';
import { RelationCrudController } from 'src/shared/controller/relation-crud.controller';
import { RelationCrudOptions } from 'src/shared/types/crud-option.type';
import { DataResponseFormat } from 'src/shared/api-data';
import { decodeCollectionQuery } from 'src/shared/collection-query';
import { CurrentUser, JwtGuard } from 'src/shared/authorization';
import { organization } from '../../seeders/seed-data';

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

  @Get(`:roleId/permission`)
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  @UseGuards(JwtGuard)
  async findAllFirst(
    @Param('roleId') roleId: string,
    @Query('q') q: string,
    @CurrentUser() user: any,
  ): Promise<DataResponseFormat<RolePermission>> {
    const query = decodeCollectionQuery(q);
    const organizationId = user.organization.id;
    return this.rolePermissionService.findAllPermission(
      roleId,
      organizationId,
      query,
    );
  }
}

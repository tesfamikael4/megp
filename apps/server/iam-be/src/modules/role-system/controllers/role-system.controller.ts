import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  CreateRoleSystemDto,
  UpdateRoleSystemDto,
} from '../dto/role-system.dto';
import { RoleSystemService } from '../services/role-system.service';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { RoleSystem } from 'src/entities/role-system.entity';
import { EntityCrudController } from 'src/shared/controller';
import { DataResponseFormat } from 'src/shared/api-data';
import { decodeCollectionQuery } from 'src/shared/collection-query';

const options: EntityCrudOptions = {
  createDto: CreateRoleSystemDto,
  updateDto: UpdateRoleSystemDto,
};

@Controller('role-systems')
@ApiTags('role-systems')
export class RoleSystemController extends EntityCrudController<RoleSystem>(
  options,
) {
  constructor(private readonly roleService: RoleSystemService) {
    super(roleService);
  }

  @Get('list/:organizationId')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  async findUnderOrganization(
    @Param('organizationId') organizationId: string,
    @Query('q') q?: string,
  ): Promise<DataResponseFormat<RoleSystem>> {
    const query = decodeCollectionQuery(q);
    return this.roleService.findUnderOrganization(organizationId, query);
  }
}

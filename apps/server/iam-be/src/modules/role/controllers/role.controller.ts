import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { DataResponseFormat } from '@api-data';
import { CreateRoleDto, UpdateRoleDto } from '../dto/role.dto';
import { RoleService } from '../services/role.service';
import { Role } from '@entities';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller/extra-crud.controller';
import { decodeCollectionQuery } from 'src/shared/collection-query/query-mapper';

const options: ExtraCrudOptions = {
  entityIdName: 'organizationId',
  createDto: CreateRoleDto,
  updateDto: UpdateRoleDto,
};

@Controller('roles')
@ApiTags('roles')
export class RoleNewController extends ExtraCrudController<Role>(options) {
  constructor(private readonly roleService: RoleService) {
    super(roleService);
  }

  @Get('list/:id/assignment')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  async findAllRoleForAssignment(
    @Param('id') id: string,
    @Query('q') q?: string,
  ): Promise<DataResponseFormat<any>> {
    const query = decodeCollectionQuery(q);

    return await this.roleService.findAllRoleForAssignment(id, query);
  }
}

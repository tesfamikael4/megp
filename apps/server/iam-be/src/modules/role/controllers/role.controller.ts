import {
  Controller,
  Get,
  Query,
  Param,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from '@api-data';
import { CreateRoleDto, UpdateRoleDto } from '../dto/role.dto';
import { RoleService } from '../services/role.service';
import { Role } from '@entities';
import { CollectionQuery } from '@collection-query';
import { EntityCrudController } from 'src/shared/controller/entity-crud.controller';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';

const options: EntityCrudOptions = {
  createDto: CreateRoleDto,
  updateDto: UpdateRoleDto,
};

@Controller('roles')
@ApiTags('roles')
export class RoleNewController extends EntityCrudController<Role>(options) {
  constructor(private readonly roleService: RoleService) {
    super(roleService);
  }

  @Get('get-all-under-organization/:organizationId')
  @ApiPaginatedResponse(Role)
  @ApiOkResponse({ type: Role, isArray: false })
  async findAllUnderOrganization(
    @Param(
      'organizationId',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    organizationId: string,
    @Query() query: CollectionQuery,
  ) {
    return await this.roleService.findAllUnderOrganization(
      organizationId,
      query,
    );
  }
}

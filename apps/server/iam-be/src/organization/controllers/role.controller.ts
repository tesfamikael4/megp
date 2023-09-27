import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Param,
  Patch,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateRoleDto, UpdateRoleDto } from '../dto/role.dto';
import { Role } from '../entities/role.entity';
import { RoleService } from '../services/role.service';
import { ApiPaginatedResponse } from 'src/shared/api-data';
import { CollectionQuery } from 'src/shared/collection-query';
import { CreateRolePermissionDto } from '../dto/role-permission.dto';
import { RolePermission } from '../entities/role-permission.entity';

@ApiBearerAuth()
@Controller('roles')
@ApiTags('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('create')
  async create(@Body() createRoleDto: CreateRoleDto) {
    return await this.roleService.create(createRoleDto);
  }

  @Get('get/:id')
  async findOne(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Query() includes: string[],
    withDeleted: boolean,
  ) {
    return await this.roleService.findOne(id, includes, withDeleted);
  }

  @Get('get-all')
  @ApiPaginatedResponse(Role)
  @ApiOkResponse({ type: Role, isArray: false })
  async findAll(@Query() query: CollectionQuery) {
    return await this.roleService.findAll(query);
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
  @Get('get-all-role-permissions/:roleId')
  @ApiPaginatedResponse(RolePermission)
  @ApiOkResponse({ type: Role, isArray: false })
  async findRolePermissions(
    @Param(
      'roleId',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    roleId: string,
    @Query() query: CollectionQuery,
  ) {
    return await this.roleService.findAllRolePermissions(roleId, query);
  }
  @Patch('update/:id')
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return await this.roleService.update(id, updateRoleDto);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.roleService.remove(id);
  }

  @Post('assign-permissions/:id')
  async assignPermissions(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() rolePermissionResponseDto: CreateRolePermissionDto[],
  ) {
    return await this.roleService.assignPermissions(
      id,
      rolePermissionResponseDto,
    );
  }
}

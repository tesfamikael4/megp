import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Param,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from '@api-data';
import { CreateRoleDto, UpdateRoleDto } from '../dto/role.dto';
import { RoleService } from '../services/role.service';
import { Role } from '../entities/role.entity';
import { CollectionQuery } from '@collection-query';
import { EntityCrudController } from 'src/shared/controller/entity-crud.controller';

@Controller('roles')
@ApiTags('roles')
export class RoleNewController extends EntityCrudController<Role> {
  constructor(private readonly roleService: RoleService) {
    super(roleService);
  }

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return await super.create(createRoleDto);
  }

  @Put(':id')
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<Role | undefined> {
    return await super.update(id, updateRoleDto);
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

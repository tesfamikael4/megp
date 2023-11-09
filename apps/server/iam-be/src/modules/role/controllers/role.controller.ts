import {
  Controller,
  Get,
  Query,
  Param,
  ParseUUIDPipe,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse, DataResponseFormat } from '@api-data';
import { CreateRoleDto, UpdateRoleDto } from '../dto/role.dto';
import { RoleService } from '../services/role.service';
import { Role } from '@entities';
import { CollectionQuery } from '@collection-query';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller/extra-crud.controller';

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

  @Get('list/:id')
  async findAll(
    @Param('id') id: string,
    @Query() query: CollectionQuery,
  ): Promise<DataResponseFormat<any>> {
    return await this.roleService.findAllUnderOrganization(id, query);
  }
}

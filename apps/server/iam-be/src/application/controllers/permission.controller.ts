import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Param,
  Patch,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse, DataResponseFormat } from '@api-data';
import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from '../dto/permission.dto';
import { PermissionService } from '../services/permission.service';
import { Permission } from '../entities/permission.entity';
import { CollectionQuery } from '@collection-query';
import { GenericCrudController } from 'src/shared/controller/generic-crud.controller';

@Controller('permission-news')
@ApiTags('permission-news')
export class PermissionNewController extends GenericCrudController<Permission> {
  constructor(private readonly permissionService: PermissionService) {
    super(permissionService);
  }

  @Get()
  async findAll(
    @Query() query: CollectionQuery,
  ): Promise<DataResponseFormat<Permission>> {
    return await super.findAll(query);
  }

  @Post()
  async create(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<Permission> {
    return await super.create(createPermissionDto);
  }

  @Put(':id')
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission | undefined> {
    return await super.update(id, updatePermissionDto);
  }
}

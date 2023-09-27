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
import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from '../dto/permission.dto';
import { Permission } from '../entities/permission.entity';
import { PermissionService } from '../services/permission.service';
import { ApiPaginatedResponse } from 'src/shared/api-data';
import { CollectionQuery } from 'src/shared/collection-query';

@ApiBearerAuth()
@Controller('permissions')
@ApiTags('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post('create')
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    return await this.permissionService.create(createPermissionDto);
  }

  @Get('get/:id')
  async findOne(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ) {
    return await this.permissionService.findOne(id);
  }

  @Get('get-all')
  @ApiPaginatedResponse(Permission)
  @ApiOkResponse({ type: Permission, isArray: false })
  async findAll(@Query() query: CollectionQuery) {
    return await this.permissionService.findAll(query);
  }
  @Get('get-all-under-application/:applicationId')
  @ApiPaginatedResponse(Permission)
  @ApiOkResponse({ type: Permission, isArray: false })
  async findAllUnderApplication(
    @Param(
      'applicationId',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    applicationId: string,
    @Query() query: CollectionQuery,
  ) {
    return await this.permissionService.findAllUnderApplication(
      applicationId,
      query,
    );
  }
  @Get('get-all-under-organization/:organizationId')
  @ApiPaginatedResponse(Permission)
  @ApiOkResponse({ type: Permission, isArray: false })
  async findAllUnderOrganization(
    @Param(
      'organizationId',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    organizationId: string,
    @Query() query: CollectionQuery,
  ) {
    return await this.permissionService.findAllUnderOrganization(
      organizationId,
      query,
    );
  }

  @Patch('update/:id')
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return await this.permissionService.update(id, updatePermissionDto);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.permissionService.remove(id);
  }
}

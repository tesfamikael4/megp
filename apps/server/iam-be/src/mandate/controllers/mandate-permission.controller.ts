import { Body, Controller, Delete, Get, Post, Put, Query, Param, Patch, ParseUUIDPipe, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse, DataResponseFormat } from '@api-data';
import { CreateMandatePermissionDto, UpdateMandatePermissionDto } from '../dto/mandate-permission.dto';
import { MandatePermissionService } from '../services/mandate-permission.service';
import { MandatePermission } from '../entities/mandate-permission.entity';
import { CollectionQuery, } from '@collection-query';
import { GenericCrudController } from 'src/shared/controller/generic-crud.controller';

@Controller('mandate-permission-news')
@ApiTags('mandate-permission-news')
export class MandatePermissionController extends GenericCrudController<MandatePermission>  {

  constructor(private readonly mandatePermissionService: MandatePermissionService) {
    super(mandatePermissionService);
  }

  @Get()
  async findAll(
    @Query() query: CollectionQuery,
  ): Promise<DataResponseFormat<MandatePermission>> {
    return await super.findAll(query);
  }

  @Post()
  async create(@Body() createMandatePermissionDto: CreateMandatePermissionDto): Promise<MandatePermission> {
    return await super.create(createMandatePermissionDto);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string,
    @Body() updateMandatePermissionDto: UpdateMandatePermissionDto,
  ): Promise<MandatePermission | undefined> {
    return await super.update(id, updateMandatePermissionDto);
  }

}
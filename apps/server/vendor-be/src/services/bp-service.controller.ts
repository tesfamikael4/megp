import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse, DataResponseFormat } from 'src/shared/api-data';
import { CollectionQuery } from 'src/shared/collection-query';
import { BpServiceService } from './service.service';
import {
  BpServiceResponse,
  CreateBpServiceDto,
  UpdateBpServiceDto,
} from './bp-service.dto';
import { EntityCrudController } from 'src/shared/controller';
import { BpServiceEntity } from './entities/bp-service';
@Controller('bp-services')
@ApiTags('bp-services')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiResponse({ status: 404, description: 'Item not found' })
@ApiResponse({ status: 400, description: 'Bad Request' })
@ApiExtraModels(DataResponseFormat)
export class BpServiceController extends EntityCrudController<BpServiceEntity> {
  constructor(private readonly bpServiceProvider: BpServiceService) {
    super(bpServiceProvider);
  }
  @Get()
  @ApiPaginatedResponse(BpServiceResponse)
  async fetch(@Query() query: CollectionQuery) {
    return await super.findAll(query);
  }
  @Get(':id')
  @ApiOkResponse({ type: BpServiceResponse })
  async getServiceById(@Param('id') id: string) {
    return await super.findOne(id);
  }
  @Post()
  @ApiOkResponse({ type: BpServiceResponse })
  async create(@Body() dto: CreateBpServiceDto) {
    return await super.create(dto);
  }
  @Put(':id')
  @ApiOkResponse({ type: BpServiceResponse })
  async update(@Param('id') id: string, @Body() dto: UpdateBpServiceDto) {
    return await super.update(dto.id, dto);
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await super.remove(id);
  }
}

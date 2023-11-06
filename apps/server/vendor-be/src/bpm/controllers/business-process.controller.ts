import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse, DataResponseFormat } from 'src/shared/api-data';
import { CollectionQuery } from 'src/shared/collection-query';
import { BusinessProcessService } from '../services/business-process.service';
import {
  BusinessProcessResponse,
  CreateBusinessProcessDto,
} from '../dtos/business-process.dto';
import { BusinessProcessEntity } from '../entities/business-process';
import { EntityCrudController } from 'src/shared/controller';
@Controller('business-processes')
@ApiTags('business-processes')
@ApiExtraModels(DataResponseFormat)
export class BusinessProcessController extends EntityCrudController<BusinessProcessEntity> {
  constructor(private readonly businessProcessService: BusinessProcessService) {
    super(businessProcessService);
  }
  @Get()
  @ApiPaginatedResponse(BusinessProcessResponse)
  async fetch(@Query() query: CollectionQuery) {
    return await super.findAll(query);
  }
  @Get(':id')
  @ApiOkResponse({ type: BusinessProcessResponse })
  async getServiceById(@Param('id') id: string) {
    return await super.findOne(id);
  }
  @Post()
  @ApiPaginatedResponse(BusinessProcessResponse)
  async create(@Body() dto: CreateBusinessProcessDto) {
    return await super.create(dto);
  }

  @Get(':id')
  async delete(@Param('id') id: string) {
    return await super.remove(id);
  }
}

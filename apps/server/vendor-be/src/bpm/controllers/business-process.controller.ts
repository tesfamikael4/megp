import { Body, Controller, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
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

  @Post()
  @ApiPaginatedResponse(BusinessProcessResponse)
  async create(@Body() dto: CreateBusinessProcessDto) {
    return await super.create(dto);
  }

  @Patch()
  @ApiPaginatedResponse(BusinessProcessResponse)
  async update(@Param('id') id, @Body() dto: CreateBusinessProcessDto) {
    return await super.update(id, dto);
  }

}

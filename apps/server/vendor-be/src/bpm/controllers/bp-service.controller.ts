import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse, DataResponseFormat } from 'src/shared/api-data';
import { CollectionQuery } from 'src/shared/collection-query';
import { BpServiceService } from '../services/service.service';
import {
  CreateBpServiceDto,
  UpdateBpServiceDto,
} from '../services/dtos/bp-service.dto';
import { BpServiceResponse } from '../services/bp-service.response';
@Controller('bp-services')
@ApiTags('bp-services')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiResponse({ status: 404, description: 'Item not found' })
@ApiResponse({ status: 400, description: 'Bad Request' })
@ApiExtraModels(DataResponseFormat)
export class BpServiceController {
  constructor(private readonly bpServiceProvider: BpServiceService) {}
  @Get('get-services')
  @ApiPaginatedResponse(BpServiceResponse)
  async fetch(@Query() query: CollectionQuery) {
    return await this.bpServiceProvider.getServices(query);
  }
  @Get('get-service/:id')
  @ApiOkResponse({ type: BpServiceResponse })
  async getServiceById(@Param('id') id: string) {
    return await this.bpServiceProvider.getById(id);
  }
  @Post('create-service')
  @ApiPaginatedResponse(BpServiceResponse)
  async create(@Body() dto: CreateBpServiceDto) {
    console.log(dto);
    return await this.bpServiceProvider.create(dto);
  }
  @Post('update-service')
  @ApiPaginatedResponse(BpServiceResponse)
  async update(@Body() dto: UpdateBpServiceDto) {
    return await this.bpServiceProvider.update(dto);
  }
  @Get('delete-service/:id')
  async delete(@Param('id') id: string) {
    return await this.bpServiceProvider.delete(id);
  }
}

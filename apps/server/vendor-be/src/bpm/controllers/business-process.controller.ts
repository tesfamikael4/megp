import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse, DataResponseFormat } from 'src/shared/api-data';
import { CollectionQuery } from 'src/shared/collection-query';
import { BusinessProcessService } from '../business-process/business-process.service';
import { BusinessProcessResponse } from '../business-process/business-process.response';
import {
  CreateBusinessProcessDto,
  UpdateBusinessProcessDto,
} from '../business-process/dtos/business-process.dto';
@Controller('business-processes')
@ApiTags('business-processes')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiResponse({ status: 404, description: 'Item not found' })
@ApiResponse({ status: 400, description: 'Bad Request' })
@ApiExtraModels(DataResponseFormat)
export class BusinessProcessController {
  constructor(
    private readonly businessProcessService: BusinessProcessService,
  ) {}
  @Get('get-business-processes')
  @ApiPaginatedResponse(BusinessProcessResponse)
  async fetch(@Query() query: CollectionQuery) {
    return await this.businessProcessService.getBusinessProcesses(query);
  }
  @Get('get-business-process/:id')
  @ApiOkResponse({ type: BusinessProcessResponse })
  async getServiceById(@Param('id') id: string) {
    return await this.businessProcessService.getById(id);
  }
  @Post('create-business-process')
  @ApiPaginatedResponse(BusinessProcessResponse)
  async create(@Body() dto: CreateBusinessProcessDto) {
    return await this.businessProcessService.create(dto);
  }
  @Post('update-business-process')
  @ApiPaginatedResponse(BusinessProcessResponse)
  async update(@Body() dto: UpdateBusinessProcessDto) {
    return await this.businessProcessService.update(dto);
  }
  @Get('delete-business-process/:id')
  async delete(@Param('id') id: string) {
    return await this.businessProcessService.delete(id);
  }
}

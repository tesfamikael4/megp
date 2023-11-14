import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DataResponseFormat } from 'src/shared/api-data';
import { BpServiceService } from '../services/service.service';
import {
  BpServiceResponse,
  CreateBpServiceDto,
  UpdateBpServiceDto,
} from '../dto/bp-service.dto';
import { EntityCrudController } from 'src/shared/controller';
import { BpServiceEntity } from '../../../entities/bp-service.entity';
@Controller('bp-services')
@ApiTags('bp-services')
@ApiExtraModels(DataResponseFormat)
export class BpServiceController extends EntityCrudController<BpServiceEntity> {
  constructor(private readonly bpServiceProvider: BpServiceService) {
    super(bpServiceProvider);
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
}

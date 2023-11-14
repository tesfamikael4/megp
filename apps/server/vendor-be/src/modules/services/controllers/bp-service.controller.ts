import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DataResponseFormat } from 'src/shared/api-data';
import { BpServiceService } from '../services/service.service';
import {
  BpServiceResponse,
  CreateBpServiceDto,
  UpdateBpServiceDto,
} from '../dto/bp-service.dto';
import { EntityCrudController } from 'src/shared/controller';
import { BpServiceEntity } from '../../../entities/bp-service.entity';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { JwtGuard } from 'src/shared/authorization';
const options: EntityCrudOptions = {
  createDto: CreateBpServiceDto,
  updateDto: UpdateBpServiceDto,
};
@ApiBearerAuth()
@Controller('bp-services')
@ApiTags('bp-services')
@ApiExtraModels(DataResponseFormat)
export class BpServiceController extends EntityCrudController<BpServiceEntity>(
  options,
) {
  constructor(private readonly bpServiceProvider: BpServiceService) {
    super(bpServiceProvider);
  }
  @UseGuards(JwtGuard)
  @Post()
  @ApiOkResponse({ type: BpServiceResponse })
  async create(@Body() dto: CreateBpServiceDto) {
    return await super.create(dto);
  }
  @UseGuards(JwtGuard)
  @Put(':id')
  @ApiOkResponse({ type: BpServiceResponse })
  async update(@Param('id') id: string, @Body() dto: UpdateBpServiceDto) {
    return await super.update(dto.id, dto);
  }
}

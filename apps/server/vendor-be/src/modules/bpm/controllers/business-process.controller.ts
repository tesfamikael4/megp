import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse, DataResponseFormat } from 'src/shared/api-data';
import { BusinessProcessService } from '../services/business-process.service';
import {
  BusinessProcessResponse,
  CreateBusinessProcessDto,
} from '../dto/business-process.dto';
import { EntityCrudController } from 'src/shared/controller';
import { BusinessProcessEntity } from 'src/entities/business-process.entity';
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

  @Patch(':/')
  @ApiPaginatedResponse(BusinessProcessResponse)
  async update(@Param('id') id, @Body() dto: CreateBusinessProcessDto) {
    return await super.update(id, dto);
  }
}

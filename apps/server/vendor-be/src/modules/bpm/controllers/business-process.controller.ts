import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse, DataResponseFormat } from 'src/shared/api-data';
import { BusinessProcessService } from '../services/business-process.service';
import {
  BusinessProcessResponse,
  CreateBusinessProcessDto,
  UpdateBusinessProcessDto,
} from '../dto/business-process.dto';
import { EntityCrudController } from 'src/shared/controller';
import { BusinessProcessEntity } from 'src/entities/business-process.entity';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { JwtGuard } from 'src/shared/authorization';

const options: EntityCrudOptions = {
  createDto: CreateBusinessProcessDto,
  updateDto: UpdateBusinessProcessDto,
};
@Controller('business-processes')
@ApiTags('business-processes')
@ApiExtraModels(DataResponseFormat)
export class BusinessProcessController extends EntityCrudController<BusinessProcessEntity>(
  options,
) {
  constructor(private readonly businessProcessService: BusinessProcessService) {
    super(businessProcessService);
  }
  @UseGuards(JwtGuard)
  @Post()
  @ApiPaginatedResponse(BusinessProcessResponse)
  async create(@Body() dto: CreateBusinessProcessDto) {
    return await super.create(dto);
  }
  @UseGuards(JwtGuard)
  @Patch(':id')
  @ApiPaginatedResponse(BusinessProcessResponse)
  async update(@Param('id') id, @Body() dto: CreateBusinessProcessDto) {
    return await super.update(id, dto);
  }
}

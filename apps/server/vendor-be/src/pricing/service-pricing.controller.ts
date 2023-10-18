import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Param,
  Patch,
  HttpStatus,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CollectionQuery } from '@collection-query';
import {
  CreateServicePriceDto,
  UpdateServicePriceDto,
} from './service-price.dto';
import { ServicePricingService } from './service-pricing.service';
import { EntityCrudController } from 'src/shared/controller';
import { ServicePrice } from './entities/service-price';

@Controller('Service-pricing')
@ApiTags('Service Prices setting')
export class ServicePricingController extends EntityCrudController<ServicePrice> {
  constructor(private readonly pricingService: ServicePricingService) {
    super(pricingService);
  }
  @Post()
  async create(@Body() dto: CreateServicePriceDto) {
    return await super.create(dto);
  }
  @Get('/:id')
  async findOne(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ) {
    return await super.findOne(id);
  }

  @Get()
  async findAll(@Query() query: CollectionQuery) {
    return await super.findAll(query);
  }
  @Patch('/:id')
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() updateTRegSettingDto: UpdateServicePriceDto,
  ) {
    return await super.update(id, updateTRegSettingDto);
  }

  @Delete('/:id')
  async remove(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ) {
    return await super.remove(id);
  }
}

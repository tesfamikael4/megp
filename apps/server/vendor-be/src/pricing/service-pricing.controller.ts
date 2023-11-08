import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Patch,
  HttpStatus,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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

  @Patch(':id')
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
  @Get('get-service-price-by-service-type/:key')
  async findServicePriceByServiceType(@Param('key') key: string) {
    return await this.pricingService.findServicePriceByServiceType(key);
  }

}

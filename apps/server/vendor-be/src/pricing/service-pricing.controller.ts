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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CreateServicePriceDto,
  UpdateServicePriceDto,
} from './service-price.dto';
import { ServicePricingService } from './service-pricing.service';
import { EntityCrudController } from 'src/shared/controller';
import { ServicePrice } from './entities/service-price';
import { CurrentUser, JwtAuthGuard } from 'src/authorization';
@ApiBearerAuth()
@Controller('Service-pricing')
@ApiTags('Service Prices setting')
export class ServicePricingController extends EntityCrudController<ServicePrice> {
  constructor(private readonly pricingService: ServicePricingService) {
    super(pricingService);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  // @UseGuards(PermissionsGuard('admin'))
  // @AllowAnonymous()
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
  @UseGuards(JwtAuthGuard)
  @Get('get-service-price-by-service-type/:key')
  async findServicePriceByServiceType(@Param('key') key: string, @CurrentUser() user: any) {
    console.log(user);
    return await this.pricingService.findServicePriceByServiceType(key);
  }



}

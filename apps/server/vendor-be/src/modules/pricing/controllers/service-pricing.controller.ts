import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  HttpStatus,
  ParseUUIDPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CreateServicePriceDto,
  UpdateServicePriceDto,
} from '../dto/service-price.dto';
import { ServicePricingService } from '../services/service-pricing.service';
import { EntityCrudController } from 'src/shared/controller';
import { ServicePrice } from '../../../entities/service-price.entity';
import { JwtGuard } from 'src/shared/authorization/guards/jwt.guard';
import { CurrentUser } from 'src/shared/authorization';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { HandlingCommonService } from 'src/modules/handling/services/handling-common-services';
const options: EntityCrudOptions = {
  createDto: CreateServicePriceDto,
  updateDto: UpdateServicePriceDto,
};
@ApiBearerAuth()
@Controller('Service-pricing')
@ApiTags('Service Prices setting')
export class ServicePricingController extends EntityCrudController<ServicePrice>(
  options,
) {
  constructor(private readonly pricingService: ServicePricingService,
    private readonly commonService: HandlingCommonService,) {
    super(pricingService);
  }

  @Post()
  @UseGuards(JwtGuard)
  // @UseGuards(PermissionsGuard('admin'))
  // @AllowAnonymous()
  async create(@Body() dto: CreateServicePriceDto, @CurrentUser() user) {
    return await super.create(dto);
  }
  @UseGuards(JwtGuard)
  @Put('/:id')
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() updateTRegSettingDto: UpdateServicePriceDto,
    @CurrentUser() user,
  ) {
    return await super.update(id, updateTRegSettingDto);
  }
  @UseGuards(JwtGuard)
  @Get('get-service-price-by-service-type/:key')
  async findServicePriceByServiceType(@Param('key') key: string) {
    return await this.pricingService.findServicePriceByServiceType(key);
  }
  @UseGuards(JwtGuard)
  @Get('get-formatted-business-classes/:key')
  async findBusinessClass(@Param('key') key: string) {
    const result = await this.pricingService.findServicePriceByServiceType(key);
    const classes = [];
    for (const item of result) {
      const bc = this.commonService.formatPriceRange(item)
      classes.push({ id: item.id, serviceId: item.serviceId, businessArea: item.businessArea, businessClass: bc });
    }
    return classes;

  }
}

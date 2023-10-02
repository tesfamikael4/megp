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
import { ApiPaginatedResponse, DataResponseFormat } from '@api-data';
import { CollectionQuery } from '@collection-query';

// import { RegistrationTypes } from 'src/shared/enums/vendor-enums';
import {
  CreateServicePriceDto,
  ServicePriceResponseDto,
  UpdateServicePriceDto,
} from './service-price.dto';
import { ServicePricingService } from './service-pricing.service';
import { ServicePriceEntity } from './entities/service-price.entity';
import { GenericCrudController } from 'src/shared/controller/generic-crud.controller';
//@ApiBearerAuth()
@Controller('Service-pricing')
@ApiTags('Service Prices setting')
export class ServicePricingController extends GenericCrudController<ServicePriceEntity> {
  //constructor(private readonly regSettingService: ServicePricingService) { }
  constructor(private readonly pricingService: ServicePricingService) {
    super(pricingService);
  }

  @Post()
  async create(@Body() dto: CreateServicePriceDto) {
    return await this.pricingService.create(dto);
  }
  @Get('/:id')
  async findOne(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ) {
    return await this.pricingService.findOne(id);
  }

  @Get()
  //  @ApiPaginatedResponse(ServicePriceResponseDto)
  // @ApiOkResponse({ type: Todo, isArray: false })
  async findAll(@Query() query: CollectionQuery) {
    return await this.pricingService.findAll(query);
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
    return await this.pricingService.update(id, updateTRegSettingDto);
  }

  @Delete('/:id')
  async remove(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ) {
    return await this.pricingService.remove(id);
  }

  @Put('soft-delete/:id')
  async softDelete(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ) {
    return await this.pricingService.softDelete(id);
  }
  @Put('restore/:id')
  async restore(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ) {
    return await this.pricingService.restore(id);
  }
  // @Get('get-registration-types')
  // async getRegistrationTypes() {
  //   const array = Object.entries(RegistrationTypes).map((entry) => {
  //     const [key, value] = entry;
  //     return {
  //       key,
  //       value,
  //     };
  //   });
  // }

  //child methods
}

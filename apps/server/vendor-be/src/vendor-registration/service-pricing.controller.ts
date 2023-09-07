import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Param,
  Patch,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse, DataResponseFormat } from '@api-data';
import { CollectionQuery } from '@collection-query';

import { RegistrationTypes } from 'src/shared/enums/vendor-enums';
import {
  CreateServicePriceDto,
  ServicePriceResponseDto,
  UpdateServicePriceDto,
} from './dto/service-price.dto';
import { ServicePricingService } from './service-pricing.service';
//@ApiBearerAuth()
@Controller('ServicePricing')
@ApiTags('Service Prices setting')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class ServicePricingController {
  constructor(private readonly regSettingService: ServicePricingService) {}
  @Post('create-service-price')
  async create(@Body() regSettingDto: CreateServicePriceDto) {
    return await this.regSettingService.create(regSettingDto);
  }

  @Get('get-service-price/:id')
  async findOne(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ) {
    return await this.regSettingService.findOne(id);
  }

  @Get('get-service-prices')
  @ApiPaginatedResponse(ServicePriceResponseDto)
  // @ApiOkResponse({ type: Todo, isArray: false })
  async findAll(@Query() query: CollectionQuery) {
    return await this.regSettingService.findAll(query);
  }

  @Patch('update-service-price/:id')
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() updateTRegSettingDto: UpdateServicePriceDto,
  ) {
    return await this.regSettingService.update(id, updateTRegSettingDto);
  }

  @Delete('delete-service-price/:id')
  async remove(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ) {
    return await this.regSettingService.remove(id);
  }
  @Get('get-registration-types')
  async getRegistrationTypes() {
    const array = Object.entries(RegistrationTypes).map((entry) => {
      const [key, value] = entry;
      return {
        key,
        value,
      };
    });
  }

  //child methods
}

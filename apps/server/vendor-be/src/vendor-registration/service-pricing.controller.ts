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
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse, DataResponseFormat } from '@api-data';
import { CollectionQuery } from '@collection-query';

// import { RegistrationTypes } from 'src/shared/enums/vendor-enums';
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
  async create(@Body() dto: CreateServicePriceDto) {
    return await this.regSettingService.create(dto);
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
  @Put('soft-delete/:id')
  async softDelete(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ) {
    return await this.regSettingService.softDelete(id);
  }
  @Put('restore/:id')
  async restore(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ) {
    return await this.regSettingService.restore(id);
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

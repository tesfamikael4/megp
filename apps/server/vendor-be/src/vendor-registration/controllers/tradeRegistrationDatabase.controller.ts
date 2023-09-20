import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataResponseFormat } from 'src/shared/api-data';
import { CollectionQuery } from 'src/shared/collection-query';
import { TradeRegistrationDatabaseService } from '../services/trade-registration-database.service';

//@ApiBearerAuth()
@Controller('TradeRegistrationDatabaseController')
@ApiTags('TradeRegistrationDatabaseController')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class TradeRegistrationDatabaseController {
  constructor(
    private readonly tradeRegistrationDatabaseService: TradeRegistrationDatabaseService,
  ) {}
  @Get('fetch')
  async fetch(@Query() query: CollectionQuery) {
    return await this.tradeRegistrationDatabaseService.fetch(query);
  }
  @Get('trade-registration-database-service-by-tinNumber/:tradeNumber')
  async TinRegistrationDatabaseServiceByTinNumber(
    @Param('tradeNumber') tradeNumber: string,
  ) {
    return await this.tradeRegistrationDatabaseService.getTradeRegistrationDatabaseServiceByTinNumber(
      tradeNumber,
    );
  }
  @Get('trade-registration-database-service-by-Id/:id')
  async getShareholdersByVendorId(
    @Param('id') Id: string,
    @Query() query: CollectionQuery,
  ) {
    return await this.tradeRegistrationDatabaseService.getTradeRegistrationDatabaseServiceById(
      Id,
      query,
    );
  }
}

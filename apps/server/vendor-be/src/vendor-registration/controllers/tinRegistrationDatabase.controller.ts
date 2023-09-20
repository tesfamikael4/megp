import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataResponseFormat } from 'src/shared/api-data';
import { TinRegistrationDatabaseService } from '../services/tin-registration-database.service';
import { CollectionQuery } from 'src/shared/collection-query';

//@ApiBearerAuth()
@Controller('TinRegistrationDatabaseController')
@ApiTags('TinRegistrationDatabaseController')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class TinRegistrationDatabaseController {
  constructor(
    private readonly tinRegistrationDatabaseService: TinRegistrationDatabaseService,
  ) {}
  @Get('fetch')
  async fetch(@Query() query: CollectionQuery) {
    return await this.tinRegistrationDatabaseService.fetch(query);
  }
  @Get('tin-registration-database-service-by-tinNumber/:tinNumber')
  async TinRegistrationDatabaseServiceByTinNumber(
    @Param('tinNumber') tinNumber: string,
  ) {
    return await this.tinRegistrationDatabaseService.getTinRegistrationDatabaseServiceByTinNumber(
      tinNumber,
    );
  }
  @Get('tin-registration-database-service-by-Id/:id')
  async getShareholdersByVendorId(
    @Param('id') Id: string,
    @Query() query: CollectionQuery,
  ) {
    return await this.tinRegistrationDatabaseService.getTinRegistrationDatabaseServiceById(
      Id,
      query,
    );
  }
}

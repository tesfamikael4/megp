import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataResponseFormat } from 'src/shared/api-data';
import { CollectionQuery } from 'src/shared/collection-query';
import { TinRegistrationDatabaseService } from '../services/tin-registration-database.service';
import { VendorInitiationBody } from '../dto/vendor.dto';
import { NCICService } from '../services/ncic.service';
import { TradeRegistrationDatabaseService } from '../services/trade-registration-database.service';

//@ApiBearerAuth()
@Controller('TinRegistrationDatabaseController')
@ApiTags('TinRegistrationDatabaseController')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class TinRegistrationDatabaseController {
  constructor(
    private readonly tinRegistrationDatabaseService: TinRegistrationDatabaseService,
  ) {}

  @Get('tin-registration-database-service-by-tinNumber')
  async TinRegistrationDatabaseServiceByTinNumber(
    // @Param('vendorInitiationData') vendorInitiationData: VendorInitiationBody,
    @Query('tinNumber') tinNumber: string,
    @Query('Country') Country: string,
    @Query('companyName') companyName: string,
    @Query('legalFormofEntity') legalFormofEntity: string,
  ) {
    const vendorInitiationData = {
      tinNumber: tinNumber,
      Country: Country,
      companyName: companyName,
      legalFormofEntity: legalFormofEntity,
    };
    return await this.tinRegistrationDatabaseService.getTinRegistrationDatabaseServiceByTinNumber(
      vendorInitiationData,
    );
  }
}

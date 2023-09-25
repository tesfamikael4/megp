import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataResponseFormat } from 'src/shared/api-data';
import { NCICService } from '../services/ncic.service';
import { CollectionQuery } from 'src/shared/collection-query';
import { VendorInitiationBody } from '../dto/vendor.dto';

//@ApiBearerAuth()
@Controller('NCIC')
@ApiTags('NCIC')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class NCICController {
  constructor(private readonly ncicService: NCICService) { }
  @Get('fetch')
  async fetch(@Query() query: CollectionQuery) {
    return await this.ncicService.fetch(query);
  }
  @Get('get-tin-registration-database-service-by-tinNumber/:VendorInitiationData')
  async getTinRegistrationDatabaseServiceByTinNumber(
    @Param('VendorInitiationData') VendorInitiationData: VendorInitiationBody,
  ) {
    return await this.ncicService.getNCICDataTinNumber(VendorInitiationData);
  }
  @Get('get-tin-registration-database-service-by-Id/:id')
  async getShareholdersByVendorId(@Param('id') Id: string) {
    return await this.ncicService.getNCICDataById(Id);
  }
}

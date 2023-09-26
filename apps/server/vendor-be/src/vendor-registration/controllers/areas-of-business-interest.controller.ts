import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataResponseFormat } from 'src/shared/api-data';
import { AreasOfBusinessInterestService } from '../services/areas-of-business-interest.service';

@Controller('AreasOfBusinessInterestController')
@ApiTags('AreasOfBusinessInterestController')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class AreasOfBusinessInterestController {
  constructor(
    private readonly areasOfBusinessInterestService: AreasOfBusinessInterestService,
  ) {}
  @Get('fetch')
  async fetch() {
    return await this.areasOfBusinessInterestService.fetch();
  }
  @Get('get-tin-registration-database-service-by-tinNumber')
  async getTinRegistrationDatabaseServiceByTinNumber(
    @Param('VendorId') VendorId: string,
  ) {
    return await this.areasOfBusinessInterestService.getAreasOfBusinessInteresteByVendorId(
      VendorId,
    );
  }
}

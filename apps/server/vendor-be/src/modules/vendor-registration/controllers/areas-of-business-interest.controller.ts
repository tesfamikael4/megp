import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataResponseFormat } from 'src/shared/api-data';
import { AreasOfBusinessInterestService } from '../services/areas-of-business-interest.service';
import { EntityCrudController } from 'src/shared/controller';
import { AreasOfBusinessInterestEntity } from 'src/entities/areas-of-business-interest.entity';

@Controller('areas-of-business-interests')
@ApiTags('areas-of-business-interests')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class AreasOfBusinessInterestController extends EntityCrudController<AreasOfBusinessInterestEntity> {
  constructor(
    private readonly areasOfBusinessInterestService: AreasOfBusinessInterestService,
  ) {
    super(areasOfBusinessInterestService);
  }
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

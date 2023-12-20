import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataResponseFormat } from 'src/shared/api-data';
import { AreasOfBusinessInterestService } from '../services/areas-of-business-interest.service';
import { AreasOfBusinessInterestEntity } from 'src/entities/areas-of-business-interest.entity';
import {
  CreateAreasOfBusinessInterest,
  UpdateAreasOfBusinessInterest,
} from '../dto/areas-of-business-interest';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { EntityCrudController } from 'src/shared/controller';
const options: EntityCrudOptions = {
  createDto: CreateAreasOfBusinessInterest,
  updateDto: UpdateAreasOfBusinessInterest,
};

@Controller('areas-of-business-interests')
@ApiTags('areas-of-business-interests')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class AreasOfBusinessInterestController extends EntityCrudController<AreasOfBusinessInterestEntity>(
  options,
) {
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

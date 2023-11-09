import { Controller, Get, Param } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataResponseFormat } from 'src/shared/api-data';
import { BusinessAreaService } from '../services/business-areaEntity.service';
import { EntityCrudController } from 'src/shared/controller';
import { BusinessAreaEntity } from '../entities/business-area';

//@ApiBearerAuth()
@Controller('business-area')
@ApiTags('business area')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class BusinessAreaController extends EntityCrudController<BusinessAreaEntity> {
  constructor(private readonly businessAreaService: BusinessAreaService) {
    super(businessAreaService);
  }
  @Get('get-business-area-by-vendorId/:vendorId')
  async getByVendorId(@Param('vendorId') vendorId: string) {
    return await this.businessAreaService.getByVendorId(vendorId);
  }
  //additional controllers
}

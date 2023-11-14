import { Controller, Get, Param } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataResponseFormat } from 'src/shared/api-data';
import { BusinessAreaService } from '../services/business-area.service';
import { EntityCrudController } from 'src/shared/controller';
import { BusinessAreaEntity } from 'src/entities';
import {
  CreateBusinessAreaDto,
  UpdateBusinessAreaDto,
} from '../dto/business-area.dto';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
const options: EntityCrudOptions = {
  createDto: CreateBusinessAreaDto,
  updateDto: UpdateBusinessAreaDto,
};
//@ApiBearerAuth()
@Controller('business-area')
@ApiTags('business area')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class BusinessAreaController extends EntityCrudController<BusinessAreaEntity>(
  options,
) {
  constructor(private readonly businessAreaService: BusinessAreaService) {
    super(businessAreaService);
  }
  @Get('get-business-area-by-vendorId/:vendorId')
  async getByVendorId(@Param('vendorId') vendorId: string) {
    return await this.businessAreaService.getByVendorId(vendorId);
  }
  //additional controllers
}

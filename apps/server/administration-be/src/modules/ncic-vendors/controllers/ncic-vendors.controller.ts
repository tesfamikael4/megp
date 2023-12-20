import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { NcicVendorsService } from '../services/ncic-vendors.service';
import {
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FppaVendor } from 'src/entities/fppa-vendor.entity';
import { NcicVendor } from 'src/entities/ncic-vendor.entity';
import { DataResponseFormat } from 'src/shared/api-data';
import { NcicDataValidation } from '../dto/ncic-data-validation';
import { EntityCrudController } from 'src/shared/controller';
import {
  CreateNcicVendorDto,
  UpdateNcicVendorDto,
} from '../dto/ncic-vendor.dto';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { GetFPPAVendorByTinDto } from 'src/modules/fppa-vendor/dto/fppa-data-validation';
const options: EntityCrudOptions = {
  createDto: CreateNcicVendorDto,
  updateDto: UpdateNcicVendorDto,
};
@Controller('ncic-vendors')
@ApiTags('NCIC')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class NcicVendorsController extends EntityCrudController<NcicVendor>(
  options,
) {
  constructor(private readonly ncicVendorsService: NcicVendorsService) {
    super(ncicVendorsService);
  }
  @Post('bulky-data')
  async createNcic(@Body() dto: NcicDataValidation): Promise<NcicVendor[]> {
    return this.ncicVendorsService.createBulkyData(dto);
  }

  @Get(':tin')
  @ApiOperation({
    summary: 'Get Vendor Information By TIN',
    description:
      'Retrieve user information by providing the Tax Identification Number (TIN).',
  })
  @ApiParam({
    name: 'tin',
    type: String,
    description: 'Tax Identification Number (TIN) of the user',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved tax payer information',
    type: FppaVendor,
  })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async getNCICVenderByTin(@Param() parm: GetFPPAVendorByTinDto) {
    return this.ncicVendorsService.getNCICVenderByTin(parm.tin);
  }
}

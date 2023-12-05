import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { FppaVendorService } from '../services/fppa-vendor.service';
import {
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FppaVendor } from '@entities';
import { DataResponseFormat } from '@api-data';
import { FppaDataValidation } from '../dto/fppa-data-validation';
import { EntityCrudController } from '@generic-controllers';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import {
  CreateFppaVendorDto,
  UpdateFppaVendorDto,
} from '../dto/fppa-vendor.dto';
const options: EntityCrudOptions = {
  createDto: CreateFppaVendorDto,
  updateDto: UpdateFppaVendorDto,
};
@Controller('fppa-vendors')
@ApiTags('FPPA')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class FppaVendorsController extends EntityCrudController<FppaVendor>(
  options,
) {
  constructor(private readonly fppaVendorService: FppaVendorService) {
    super(fppaVendorService);
  }

  @Post('bulk-save')
  async createFppa(@Body() dto: FppaDataValidation): Promise<FppaVendor[]> {
    return this.fppaVendorService.createBulkyData(dto);
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
  async getFPPAVenderByTin(@Param('tin') tin: string) {
    return this.fppaVendorService.getFPPAVenderByTin(tin);
  }
}

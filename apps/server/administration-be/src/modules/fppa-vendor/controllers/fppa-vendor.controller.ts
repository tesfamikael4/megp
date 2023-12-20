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
import {
  FppaDataValidation,
  GetFPPAVendorByTinDto,
} from '../dto/fppa-data-validation';
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
  async getFPPAVenderByTin(@Param() parms: GetFPPAVendorByTinDto) {
    return this.fppaVendorService.getFPPAVenderByTin(parms.tin);
  }
}

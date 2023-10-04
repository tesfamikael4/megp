import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Param,
  Patch,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse, DataResponseFormat } from '@api-data';
import { CollectionQuery } from '@collection-query';

import { VendorRegistrationsService } from './vendor-registration.service';
import { InsertAllDataDto } from './dto/save-all.dto';
import { SetVendorStatus } from './dto/vendor.dto';
//@ApiBearerAuth()
@Controller('VendorRegistrations')
@ApiTags('Vendor-registrations')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class VendorRegistrationsController {
  constructor(
    private readonly regService: VendorRegistrationsService, // private readonly bpServiceService: BpServiceService
  ) {}

  @Get('get-vendors')
  async getVendors() {
    return await this.regService.getVendors();
  }
  @Get('get-vendor-status-byId/:vendorId')
  async getVendorStatusById(@Param('vendorId') vendorId: string) {
    return await this.regService.getVendorStatusByVendorId(vendorId);
  }
  @Get('get-vendor-by-vendorId/:vendorId')
  async getVendorByVendorId(@Param('vendorId') vendorId: string) {
    return await this.regService.getVendorId(vendorId);
  }
  @Get('get-vendor-by-userId/:userId')
  async getVendorByuserId(@Param('userId') userId: string) {
    return await this.regService.getVendorByUserId(userId);
  }
  @Get('get-vendor-information-by-vendorId/:vendorId')
  async getVendorInformationByVendorId(@Param('vendorId') vendorId: string) {
    return await this.regService.getVendorInformation(vendorId);
  }
  @Post('add-vendor-information')
  async addVendorInformation(@Body() data: InsertAllDataDto) {
    return await this.regService.addVendorInformations(data);
  }
  @Post('set-application-status')
  async setVendorStatus(@Body() vendorStatus: SetVendorStatus) {
    return await this.regService.setVendorStatus(vendorStatus);
  }

  @Get('get-application-by-status/:status')
  async getVendorByStatus(@Param('status') status: string) {
    return await this.regService.getVendorByStatus(status);
  }
  @Get('get-vendor-application-information')
  async getVendorApplicationInformation() {
    return await this.regService.getVendorApplicationInformation();
  }
}

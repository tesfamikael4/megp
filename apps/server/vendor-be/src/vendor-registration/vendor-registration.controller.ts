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
  Res,
  BadRequestException,
} from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse, DataResponseFormat } from '@api-data';
import { CollectionQuery } from '@collection-query';

import { VendorRegistrationsService } from './vendor-registration.service';
import { InsertAllDataDto } from './dto/save-all.dto';
import { SetVendorStatus } from './dto/vendor.dto';
import { Response } from 'express';
import { VendorInitiationDto } from './dto/vendor-initiation.dto';
import { CreateAreasOfBusinessInterest } from './dto/areas-of-business-interest';
//@ApiBearerAuth()
@Controller('vendor-registrations')
@ApiTags('Vendor-registrations')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class VendorRegistrationsController {
  constructor(private readonly regService: VendorRegistrationsService) {}
  @Get('get-vendors')
  async getVendors() {
    return await this.regService.getVendors();
  }
  @Get('get-vendor-status-byId/:vendorId')
  async getVendorStatusById(@Param('vendorId') vendorId: string) {
    vendorId = 'b23f0b00-0a59-4f6d-9fd9-34d6fa960e0';
    vendorId = 'b23f0b00-0a59-4f6d-9fd9-34d6fa960e0';
    return await this.regService.getVendorStatusByVendorId(vendorId);
  }
  @Get('get-vendor-byVendorId/:vendorId')
  async getVendorStatusByVendorId(@Param('vendorId') vendorId: string) {
    return await this.regService.getVendorByVendorId(vendorId);
  }
  @Get('get-vendor-by-vendorId/:vendorId')
  async getVendorByVendorId(@Param('vendorId') vendorId: string) {
    vendorId = 'b23f0b00-0a59-4f6d-9fd9-34d6fa960e0';
    return await this.regService.getVendorId(vendorId);
  }
  @Get('get-vendor-area-of-interest-by-vendorId')
  async getVendorAreaOfInterestByVendorId() {
    const userId = 'b23f0b00-0a59-4f6d-9fd9-34d6fa960e0';
    return await this.regService.getVendorAreaOfInterestByVendorId(userId);
  }
  @Post('add-vendor-area-of-interest-To-vendor')
  async addVendorAreaOfInterestByVendorId(
    @Body() createAreasOfBusinessInterest: CreateAreasOfBusinessInterest[],
  ) {
    createAreasOfBusinessInterest[0].userId =
      'b23f0b00-0a59-4f6d-9fd9-34d6fa960e0';
    return await this.regService.addVendorAreaOfInterestByVendorId(
      createAreasOfBusinessInterest,
    );
  }
  @Get('get-vendor-by-userId/:userId')
  async getVendorByuserId(@Param('userId') userId: string) {
    userId = 'b23f0b00-0a59-4f6d-9fd9-34d6fa960e0';
    return await this.regService.getVendorByUserId(userId);
  }

  @Get('get-vendor-information-by-vendorId/:vendorId')
  async getVendorInformationByVendorId(@Param('vendorId') vendorId: string) {
    vendorId = 'b23f0b00-0a59-4f6d-9fd9-34d6fa960e0';
    return await this.regService.getVendorInformation(vendorId);
  }
  @Post('add-vendor-information')
  async addVendorInformation(
    @Body() data: InsertAllDataDto,
    @Res() res: Response,
  ) {
    console.log(data);
    data.data.userId = 'b23f0b00-0a59-4f6d-9fd9-34d6fa960e0';
    if (data.data.userId == '' || data.data.userId == undefined) {
      throw new BadRequestException(`application Id is mandatory`);
    }
    const result = await this.regService.addVendorInformations(data.data);
    return res.status(200).json({ message: 'Success' });
  }
  @Post('vendor-initiation')
  async VendorInitiation(@Body() vendorInitiationDto: VendorInitiationDto) {
    vendorInitiationDto.userId = 'b23f0b00-0a59-4f6d-9fd9-34d6fa960e0';
    vendorInitiationDto.status = 'Draft';
    return await this.regService.VendorInitiation(vendorInitiationDto);
  }
  @Post('set-application-status')
  async setVendorStatus(@Body() vendorStatus: SetVendorStatus) {
    vendorStatus.userId = 'b23f0b00-0a59-4f6d-9fd9-34d6fa960e0';
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
  @Post('delete-vendor-info/:vendorId')
  async changeVendorUserId(@Param('vendorId') vendorId: string) {
    return await this.regService.deleteVendorById(vendorId);
  }
}

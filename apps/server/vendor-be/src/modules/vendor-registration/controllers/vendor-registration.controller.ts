import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DataResponseFormat } from '@api-data';

import { VendorRegistrationsService } from '../services/vendor-registration.service';
import { VendorInitiationDto } from '../dto/vendor-initiation.dto';
import { CreateAreasOfBusinessInterest } from '../dto/areas-of-business-interest';

import { CurrentUser, JwtGuard } from 'src/shared/authorization';
import { InsertAllDataDto } from '../dto/save-all.dto';
import { SetVendorStatus } from '../dto/vendor.dto';
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('vendor-registrations')
@ApiTags('Vendor-registrations')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class VendorRegistrationsController {
  userInfo: any;
  constructor(private readonly regService: VendorRegistrationsService) {}
  @Get('get-isr-vendors')
  async getVendors() {
    return await this.regService.getIsrVendors();
  }

  @Get('get-vendor-status-byId/:vendorId')
  async getVendorStatusById(@CurrentUser() userInfo: any) {
    return await this.regService.getVendorStatusByVendorId(userInfo.id);
  }

  @Post('add-vendor-area-of-interest-To-vendor')
  async addVendorAreaOfInterestByVendorId(
    @Body() createAreasOfBusinessInterest: CreateAreasOfBusinessInterest[],
    @CurrentUser() userInfo: any,
  ) {
    createAreasOfBusinessInterest[0].userId = userInfo.id;
    return await this.regService.addVendorAreaOfInterestByVendorId(userInfo.id);
  }
  @Get('get-vendor-by-userId')
  async getVendorByuserId(@CurrentUser() userInfo: any) {
    return await this.regService.getVendorByUserId(userInfo.id);
  }
  @Get('get-isr-vendor-by-userId')
  async getIsrVendorByuserId(@CurrentUser() userInfo: any) {
    return await this.regService.getIsrVendorByUserId(userInfo.id);
  }
  @Get('get-isr-vendor-by-id/:vendorId')
  async getVendorByVendorId(@Param('vendorId') vendorId: string) {
    return await this.regService.getIsrVendorByVendorId(vendorId);
  }
  @Get('get-isr-vendor-invoice-by-userId')
  async getIsrVendorInvoiceByuserId(@CurrentUser() userInfo: any) {
    return await this.regService.getIsrVendorInvoiceByUserId(userInfo.id);
  }
  @Get('get-isr-vendor-info-by-userId')
  async getPendingIsrVendorByuserId(@CurrentUser() userInfo: any) {
    return await this.regService.getPendingIsrVendorByuserId(userInfo.id);
  }

  @Get('get-completed-isr-vendor-by-userId')
  async getCompletedIsrVendorByuserId(@CurrentUser() userInfo: any) {
    return await this.regService.getCompletedIsrVendorByuserId(userInfo.id);
  }
  @Post('add-vendor-information')
  async addVendorInformation(
    @Body() data: InsertAllDataDto,
    @CurrentUser() userInfo: any,
  ) {
    data.data.initial.userId = userInfo.id;
    const result = await this.regService.addVendorInformations(
      data.data,
      userInfo,
    );
    if (!result) throw new BadRequestException(`vendor registration failed`);
    return result;
  }
  @Post('vendor-initiation')
  async VendorInitiation(
    @Body() vendorInitiationDto: VendorInitiationDto,
    @CurrentUser() user: any,
  ) {
    vendorInitiationDto.status = 'Save as Draft';
    vendorInitiationDto.level = 'detail';
    return await this.regService.vendorInitiation(vendorInitiationDto, user);
  }
  @Post('approve-vendor-services')
  async approveVednorServices(@Body() vendorStatusDto: SetVendorStatus) {
    return await this.regService.approveVendor(vendorStatusDto);
  }
  @Post('adjust-vendor-services')
  async adjustVednorServices(@Body() vendorStatusDto: SetVendorStatus) {
    return await this.regService.adjustVendor(vendorStatusDto);
  }
  @Post('set-application-status')
  async setVendorStatus(@Body() vendorStatusDto: SetVendorStatus) {
    return await this.regService.setVendorStatus(vendorStatusDto);
  }
  @Post('set-isr-vendor-status')
  async setIsrVendorStatus(@CurrentUser() userInfo: any) {
    return await this.regService.setIsrVendorStatus(userInfo);
  }
  @Get('get-application-by-status/:status')
  async getVendorByStatus(@Param('status') status: string) {
    return await this.regService.getVendorByStatus(status);
  }
  @Post('update-vendor')
  async updateVendor(@Body() vendor: any) {
    vendor.userId = 'b23f0b00-0a59-4f6d-9fd9-34d6fa960e0';
    return await this.regService.setVendorStatus(vendor);
  }
  @Post('delete-vendor-info/:vendorId')
  async changeVendorUserId(@Param('vendorId') vendorId: string) {
    return await this.regService.deleteVendorById(vendorId);
  }
}

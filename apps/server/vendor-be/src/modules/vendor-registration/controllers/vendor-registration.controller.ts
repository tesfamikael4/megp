import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  BadRequestException,
  UseGuards,
  Req,
  Query,
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

import { ApiKeyGuard, CurrentUser, JwtGuard } from 'src/shared/authorization';
import { InsertAllDataDto } from '../dto/save-all.dto';
import { SetVendorStatus } from '../dto/vendor.dto';
import { CollectionQuery } from 'src/shared/collection-query';
@ApiBearerAuth()
@Controller('vendor-registrations')
@ApiTags('Vendor-registrations')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class VendorRegistrationsController {
  constructor(private readonly regService: VendorRegistrationsService) {}
  @UseGuards(JwtGuard)
  @Get('get-isr-vendors')
  async getVendors() {
    return await this.regService.getIsrVendors();
  }
  @UseGuards(JwtGuard)
  @Get('get-vendor-by-userId')
  async getVendorByuserId(@CurrentUser() userInfo: any) {
    return await this.regService.getVendorByUserId(userInfo.id);
  }
  @UseGuards(JwtGuard)
  @Get('get-isr-vendor-by-userId')
  async getIsrVendorByuserId(@CurrentUser() userInfo: any) {
    return await this.regService.getIsrVendorByUserId(userInfo.id);
  }
  @UseGuards(JwtGuard)
  @Get('get-isr-vendor-info-by-userId')
  async getPendingIsrVendorByuserId(@CurrentUser() userInfo: any) {
    return await this.regService.getPendingIsrVendorByUserId(userInfo.id);
  }
  @UseGuards(JwtGuard)
  @Get('get-isr-vendor-by-id/:vendorId')
  async getVendorByVendorId(@Param('vendorId') vendorId: string) {
    return await this.regService.getIsrVendorByVendorId(vendorId);
  }
  @UseGuards(JwtGuard)
  @Get('get-isr-vendor-invoice-by-userId')
  async getIsrVendorInvoiceByuserId(@CurrentUser() userInfo: any) {
    return await this.regService.getIsrVendorInvoiceByUserId(userInfo.id);
  }
  @UseGuards(JwtGuard)
  @Post('add-vendor-information')
  async addVendorInformation(
    @Body() data: InsertAllDataDto,
    @CurrentUser() userInfo: any,
    @Req() request: Request,
  ) {
    const authToken = request.headers['authorization'].split(' ')[1];
    userInfo['token'] = authToken;
    data.data.initial.userId = userInfo.id;
    const result = await this.regService.addVendorInformations(
      data.data,
      userInfo,
    );
    if (!result) throw new BadRequestException(`vendor registration failed`);
    return result;
  }
  @UseGuards(JwtGuard)
  @Post('submit-vendor-information')
  async submitVendorInformations(
    @Body() data: InsertAllDataDto,
    @CurrentUser() userInfo: any,
    @Req() request: Request,
  ) {
    const authToken = request.headers['authorization'].split(' ')[1];
    userInfo['token'] = authToken;
    data.data.initial.userId = userInfo.id;
    const result = await this.regService.submitVendorInformations(
      data.data,
      userInfo,
    );
    if (!result) throw new BadRequestException(`vendor_submission_failed`);
    return result;
  }
  @UseGuards(JwtGuard)
  @Post('vendor-initiation')
  async VendorInitiation(
    @Body() vendorInitiationDto: VendorInitiationDto,
    @CurrentUser() user: any,
    @Query() quer: CollectionQuery,
  ) {
    vendorInitiationDto.status = 'Draft';
    vendorInitiationDto.level = 'detail';
    return await this.regService.vendorInitiation(vendorInitiationDto, user);
  }
  @UseGuards(ApiKeyGuard)
  @Post('update-vendor-services')
  async approveVednorServices(@Body() vendorStatusDto: SetVendorStatus) {
    return await this.regService.updateVendor(vendorStatusDto);
  }

  @UseGuards(ApiKeyGuard)
  @Post('adjust-vendor-services')
  async adjustVednorServices(@Body() vendorStatusDto: SetVendorStatus) {
    return await this.regService.adjustVendor(vendorStatusDto);
  }
}

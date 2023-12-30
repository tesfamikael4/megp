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

import {
  AllowAnonymous,
  ApiKeyGuard,
  CurrentUser,
  JwtGuard,
} from 'src/shared/authorization';
import { InsertAllDataDto } from '../dto/save-all.dto';
import { SetVendorStatus } from '../dto/vendor.dto';
import { CollectionQuery } from 'src/shared/collection-query';
import { UpgradeInfoDTO, VendorUpgradeDto } from '../dto/vendor-upgrade.dto';
@ApiBearerAuth()
@Controller('vendor-registrations')
@ApiTags('Vendor-registrations')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class VendorRegistrationsController {
  constructor(private readonly regService: VendorRegistrationsService) { }
  @UseGuards(JwtGuard)
  @Get('get-isr-vendors')
  async getVendors() {
    return await this.regService.getIsrVendors();
  }
  // @UseGuards(JwtGuard)
  @AllowAnonymous()
  @Get('get-vendor-by-userId/:userId')
  async getVendorByuserId(@CurrentUser() userInfo: any) {
    // return await this.regService.getVendorByUserId(userInfo.id);
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
  ) {
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
  ) {
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
  // @UseGuards(ApiKeyGuard)
  @Post('update-vendor-services')
  async approveVednorServices(@Body() vendorStatusDto: SetVendorStatus) {
    return await this.regService.updateVendor(vendorStatusDto);
  }

  @UseGuards(ApiKeyGuard)
  @Post('adjust-vendor-services')
  async adjustVednorServices(@Body() vendorStatusDto: SetVendorStatus) {
    return await this.regService.adjustVendor(vendorStatusDto);
  }
  // @UseGuards(JwtGuard)
  @AllowAnonymous()
  @Get('get-vendor-byId-for-certificate/:isrvendorId')
  async getVendorByIdForCertificate(@Param('isrvendorId') isrvendorId: string) {
    return await this.regService.getVendorByIdForCertificate(isrvendorId);
  }
  // @UseGuards(JwtGuard)
  @AllowAnonymous()
  @Get('get-approved-vendor-byId/:vendorId')
  async getApprovedVendorById(@Param('vendorId') vendorId: string) {
    return await this.regService.getApprovedVendorById(vendorId);
  }
  @UseGuards(JwtGuard)
  @AllowAnonymous()
  @Get('get-renewal-isr-vendor')
  async getRenewalIsrVendor(@CurrentUser() userInfo: any) {
    return await this.regService.getRenewalIsrVendor(userInfo);
  }
  @UseGuards(JwtGuard)
  @Get('get-approved-vendor-service-byUserId')
  async getApprovedVendorServiceByUserId(@CurrentUser() userInfo: any) {
    return await this.regService.getApprovedVendorServiceByUserId(userInfo.id);
  }



  @UseGuards(JwtGuard)
  @Post('generate-service-invoice-for-renewal')
  async generateServiceInvoiceForRenewal(
    @CurrentUser() userInfo: any,
    @Body() areaOfBusinessInterest: any,
  ) {
    return await this.regService.getServiceInvoiceForRenewal(
      userInfo,
      areaOfBusinessInterest,
    );
  }
  @UseGuards(JwtGuard)
  @Post('submit-service-renewal')
  async submitServiceRenewal(
    @CurrentUser() userInfo: any,
    @Body() areaOfBusinessInterest: any[],
  ) {
    return await this.regService.submitServiceRenewal(
      userInfo.id,
      areaOfBusinessInterest,
    );
  }
  @UseGuards(JwtGuard)
  @Post('generate-service-invoice-for-upgrade')
  async generateServiceInvoiceForUpgrade(
    @CurrentUser() userInfo: any,
    @Body() areaOfBusinessInterest: UpgradeInfoDTO,
  ) {
    return await this.regService.getServiceInvoiceForUpgrade2(
      userInfo,
      areaOfBusinessInterest,
    );
  }
  @UseGuards(JwtGuard)
  @Post('submit-service-upgrade')
  async submitServiceUpgrade(
    @CurrentUser() userInfo: any,
    @Body() areaOfBusinessInterest: any[],
  ) {
    return await this.regService.upgradevendorService(
      userInfo.id, areaOfBusinessInterest
    );
  }

  @UseGuards(JwtGuard)
  @Get('get-my-approved-services')
  async getMyApprovedService(@CurrentUser() userInfo: any) {
    return await this.regService.getMyApprovedService(userInfo);
  }
}

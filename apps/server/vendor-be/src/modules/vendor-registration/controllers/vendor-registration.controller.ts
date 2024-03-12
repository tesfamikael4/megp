import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  BadRequestException,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiExtraModels,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DataResponseFormat } from '@api-data';
import { VendorRegistrationsService } from '../services/vendor-registration.service';
import { VendorInitiationDto } from '../dto/vendor-initiation.dto';
import {
  AllowAnonymous,
  CurrentUser,
  JwtGuard,
} from 'src/shared/authorization';
import { InsertAllDataDto } from '../dto/save-all.dto';
import { SetVendorStatus } from '../dto/vendor.dto';
import { CollectionQuery } from 'src/shared/collection-query';
import { MbrsDataDto } from '../dto/mbrsData.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReceiptDto } from '../dto/receipt.dto';
import { CreateAreasOfBusinessInterest } from '../dto/areas-of-business-interest';
import { ServiceKeyEnum } from 'src/shared/enums/service-key.enum';
@ApiBearerAuth()
@Controller('vendor-registrations')
@ApiTags('Vendor-registrations')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class VendorRegistrationsController {
  constructor(private readonly regService: VendorRegistrationsService) { }
  @Get('get-isr-vendors')
  async getVendors() {
    return await this.regService.getIsrVendors();
  }

  @Get('get-vendor-by-userId')
  async getVendorByuserId(@CurrentUser() userInfo: any) {
    // return await this.regService.getVendorByUserId(userInfo.id);
    return await this.regService.getVendorByUserId(userInfo.id);
  }
  @Get('get-application-status-by-userId')
  async getApplicationStatus(@CurrentUser() userInfo: any) {
    // return await this.regService.getVendorByUserId(userInfo.id);
    return await this.regService.getApplicationStatus(userInfo.id);
  }
  @Get('track-application')
  async trackApplication(
    @CurrentUser() user: any
  ) {
    return await this.regService.trackApplication(user);
  }
  @Get('get-isr-vendor-by-userId')
  async getIsrVendorByuserId(
    @CurrentUser() userInfo: any,
    @Query('flag') flag: string,
  ) {
    return await this.regService.getIsrVendorByUserId(userInfo.id, flag);
  }

  @Get('get-isr-vendor-by-userId/:status')
  async getApplicationsByUserIdAndStatus(
    @CurrentUser() userInfo: any,
    @Param('status') status: string,
  ) {
    return await this.regService.getApplicationsByUserIdAndStatus(
      userInfo.id,
      status,
    );
  }
  @Get('get-isr-vendor-info-by-userId')
  async getApprovedIsrVendorByUserId(@CurrentUser() userInfo: any) {
    return await this.regService.getPendingIsrVendorByUserId(userInfo.id);
  }
  @Get('get-invoice-by-userId')
  async getInvoiceByUserId(@CurrentUser() userInfo: any) {
    return await this.regService.getInvoiceByUserId(userInfo.id);
  }

  @Get('get-approved-isr-vendor-info-by-userId/:status')
  async getPendingIsrVendorByuserId(
    @CurrentUser() userInfo: any,
    @Param('status') status: string,
  ) {
    return await this.regService.getIsrVendorByStatusBUserId(
      userInfo.id,
      status,
    );
  }
  @Get('get-pending-services')
  async getPendingServices(@CurrentUser() userInfo: any) {
    return await this.regService.getPendingServices(userInfo.id);
  }
  @Get('get-isr-vendor-by-id/:vendorId')
  async getVendorByVendorId(@Param('vendorId') vendorId: string) {
    return await this.regService.getIsrVendorByVendorId(vendorId);
  }
  /*
  featch new registration invoices of a venodr
  */

  @Get('get-isr-vendor-invoice-by-userId')
  async getIsrVendorInvoiceByuserId(@CurrentUser() userInfo: any) {
    return await this.regService.getIsrVendorInvoiceByUserId(userInfo.id);
  }

  @Post('add-vendor-information')
  async addVendorInformation(
    @Body() data: InsertAllDataDto,
    @CurrentUser() userInfo: any,
  ) {
    data.data.userId = userInfo.id;
    const result = await this.regService.addVendorInformations(
      data.data,
      userInfo,
    );
    if (!result) throw new BadRequestException(`vendor registration failed`);
    return result;
  }
  @Post('draft-vendor-information')
  async addDraftVendorInformation(
    @Body() data: InsertAllDataDto,
    @CurrentUser() userInfo: any,
  ) {
    data.data.userId = userInfo.id;
    const result = await this.regService.addDraftVendorInformation(
      data.data,
      userInfo,
    );
    if (!result) throw new BadRequestException(`vendor registration failed`);
    return result;
  }
  @Post('submit-vendor-information')
  async submitNewRegistratinRequest(
    @Body() data: InsertAllDataDto,
    @CurrentUser() userInfo: any,
  ) {
    data.data.userId = userInfo.id;
    const result = await this.regService.submitVendorInformation(
      data.data,
      userInfo,
    );
    if (!result) throw new BadRequestException(`vendor_submission_failed`);
    return result;
  }

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

  // @UseGuards(ApiKeyGuard)
  @Post('adjust-vendor-services')
  async adjustVednorServices(@Body() vendorStatusDto: SetVendorStatus) {
    return await this.regService.adjustVendor(vendorStatusDto);
  }

  @AllowAnonymous()
  @Get('get-vendor-byId-for-certificate/:isrvendorId')
  async getVendorByIdForCertificate(@Param('isrvendorId') isrvendorId: string) {
    return await this.regService.getVendorByIdForCertificate(isrvendorId);
  }

  @AllowAnonymous()
  @Get('get-approved-vendor-byId/:vendorId')
  async getApprovedVendorById(@Param('vendorId') vendorId: string) {
    return await this.regService.getApprovedVendorById(vendorId);
  }

  @AllowAnonymous()
  @Get('get-renewal-isr-vendor')
  async getRenewalIsrVendor(@CurrentUser() userInfo: any) {
    return await this.regService.getRenewalIsrVendor(userInfo);
  }

  @Get('get-approved-vendor-service-byUserId')
  async getApprovedVendorServiceByUserId(@CurrentUser() userInfo: any) {
    return await this.regService.getApprovedVendorServiceByUserId(userInfo.id);
  }
  @Post('add-service')
  async addService(
    @CurrentUser() userInfo: any,
    @Body() command: CreateAreasOfBusinessInterest[],
  ) {
    return await this.regService.addService(command, userInfo);
  }

  @Post('upgrade-service')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('attachmentUrl'))
  async upgradeService(
    @UploadedFile() attachment: Express.Multer.File,
    @CurrentUser() user: any,
    @Body() dto: ReceiptDto,
  ) {
    return await this.regService.submitServiceUpgradeOrRenewal(attachment, user, dto, ServiceKeyEnum.REGISTRATION_UPGRADE);
  }



  @Post('renew-service')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('attachmentUrl'))
  async renewService(
    @UploadedFile() attachment: Express.Multer.File,
    @CurrentUser() user: any,
    @Body() dto: ReceiptDto,
  ) {
    return await this.regService.submitServiceUpgradeOrRenewal(attachment, user, dto, ServiceKeyEnum.REGISTRATION_RENEWAL);
  }

  @Get('get-my-approved-services')
  async getMyApprovedService(@CurrentUser() userInfo: any) {
    return await this.regService.getMyApprovedService(userInfo);
  }

  @Get('cancel-registration')
  async cancelRegistration(@CurrentUser() user: any) {
    return await this.regService.cancelRegistration(user);
  }

  @Get('get-all-business-area')
  async getAllBusinessAreasByUserId(@CurrentUser() userInfo: any) {
    return await this.regService.getAllBusinessAreasByUserId(userInfo.id);
  }

  @Get('get-vendor-information')
  async getVendorInformation(@CurrentUser() userInfo: any) {
    return await this.regService.getVendorInformation(userInfo.id);
  }

  @Post('add-vendor-update-information')
  async addVendorProfileUpdate(
    @Body() vendorprofileUpdateDara: any,
    @CurrentUser() userInfo: string,
  ) {
    return await this.regService.addVendorProfileUpdate(
      vendorprofileUpdateDara,
      userInfo,
    );
  }

  @Post('submit-vendor-update-information')
  async submitVendorProfileUpdate(
    @Body() vendorprofileUpdateDara: any,
    @CurrentUser() userInfo: string,
  ) {
    return await this.regService.submitVendorProfileUpdate(
      vendorprofileUpdateDara,
      userInfo,
    );
  }
  @Get('get-mbrs-data')
  async GetMBRSData(@Body() mbrsDataDto: MbrsDataDto) {
    return await this.regService.GetMBRSData(mbrsDataDto);
  }
  @Get('get-ncic-data/:licenseNumber')
  async GetNCICData(@Param('licenseNumber') licenseNumber: string) {
    return await this.regService.GetNCICData(licenseNumber);
  }

  @Get('get-fppa-data/:licenseNumber')
  async GetFPPAData(@Param('licenseNumber') licenseNumber: string) {
    return await this.regService.GetFPPAData(licenseNumber);
  }

  @Get('get-certificate-informations')
  async getCertificateInformations(@CurrentUser() userInfo: any) {
    return await this.regService.getCertificateInformations(userInfo.id);
  }

  @Get('get-preferential-certificate')
  async getpreferentialCertificates(@CurrentUser() userInfo: any) {
    return await this.regService.getCertificateInformations(userInfo.id);
  }

}

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
  ApiKeyGuard,
  CurrentUser,
  JwtGuard,
} from 'src/shared/authorization';
import { InsertAllDataDto } from '../dto/save-all.dto';
import { SetVendorStatus } from '../dto/vendor.dto';
import { CollectionQuery } from 'src/shared/collection-query';
import { MbrsDataDto } from '../dto/mbrsData.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReceiptDto } from '../dto/receipt.dto';
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
  //bug will be fixed
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

  // @UseGuards(ApiKeyGuard)
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
  @Post('upgrade-service')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('attachmentUrl'))
  async upgradeService(
    @UploadedFile() attachment: Express.Multer.File,
    @CurrentUser() user: any,
    @Body() dto: ReceiptDto,
  ) {
    return await this.regService.submitServiceUpgrade(attachment, user, dto);
  }
  @UseGuards(JwtGuard)
  @Post('renew-service')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('attachmentUrl'))
  async renewService(
    @UploadedFile() attachment: Express.Multer.File,
    @CurrentUser() user: any,
    @Body() dto: ReceiptDto,
  ) {
    return await this.regService.submitServiceUpgrade(attachment, user, dto);
  }

  @UseGuards(JwtGuard)
  @Get('get-my-approved-services')
  async getMyApprovedService(@CurrentUser() userInfo: any) {
    return await this.regService.getMyApprovedService(userInfo);
  }
  @UseGuards(JwtGuard)
  @Get('cancel-registration')
  async cancelRegistration(@CurrentUser() user: any) {
    return await this.regService.cancelRegistration(user);
  }

  @UseGuards(JwtGuard)
  @Get('get-all-business-area')
  async getAllBusinessAreasByUserId(@CurrentUser() userInfo: any) {
    return await this.regService.getAllBusinessAreasByUserId(userInfo.id);
  }
  @UseGuards(JwtGuard)
  @Get('get-vendor-information')
  async getVendorInformation(@CurrentUser() userInfo: any) {
    return await this.regService.getVendorInformation(userInfo.id);
  }

  @UseGuards(JwtGuard)
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
  @UseGuards(JwtGuard)
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

  @UseGuards(JwtGuard)
  @Get('get-mbrs-data')
  async GetMBRSData(@Body() mbrsDataDto: MbrsDataDto) {
    return await this.regService.GetMBRSData(mbrsDataDto);
  }
  @UseGuards(JwtGuard)
  @Get('get-fppa-data/:tinNumber')
  async GetFPPAData(
    @Param('tinNumber') tinNumber: string,
    @Param('licenseNumber') licenseNumber: string,
  ) {
    return await this.regService.GetFPPAData(tinNumber);
  }

  @UseGuards(JwtGuard)
  @Get('get-certificate-informations')
  async getCertificateInformations(@CurrentUser() userInfo: any) {
    return await this.regService.getCertificateInformations(userInfo.id);
  }
  @UseGuards(JwtGuard)
  @Get('get-preferential-certificate')
  async getpreferentialCertificates(@CurrentUser() userInfo: any) {
    return await this.regService.getCertificateInformations(userInfo.id);
  }
}

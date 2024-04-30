import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  BadRequestException,
  Query,
  UseInterceptors,
  UploadedFile,
  Res,
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
import { AllowAnonymous, CurrentUser } from 'src/shared/authorization';
import { InsertAllDataDto } from '../dto/save-all.dto';
import { SetVendorStatus } from '../dto/vendor.dto';
import { CollectionQuery } from 'src/shared/collection-query';
import { MbrsDataDto } from '../dto/mbrsData.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReceiptDto } from '../dto/receipt.dto';
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
  async trackApplication(@CurrentUser() user: any) {
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
  //new registration request draft
  @Post('add-vendor-information')
  async draftVendorNewRegistrationRequest(
    @Body() data: InsertAllDataDto,
    @CurrentUser() userInfo: any,
  ) {
    data.data.userId = userInfo.id;
    const result = await this.regService.draftVendorNewRegistrationRequest(
      data.data,
      userInfo,
    );
    if (!result) throw new BadRequestException(`vendor registration failed`);
    return result;
  }

  @Post('submit-vendor-registration-request')
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
  //additional services registration
  @Post('add-service')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('attachmentUrl'))
  async addService(
    @UploadedFile() attachment: Express.Multer.File,
    @CurrentUser() user: any,
    @Body() paymentReceiptDto: ReceiptDto,
  ) {
    return await this.regService.addService(
      paymentReceiptDto,
      attachment,
      user,
    );
  }

  @Post('upgrade-service')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('attachmentUrl'))
  async upgradeService(
    @UploadedFile() attachment: Express.Multer.File,
    @CurrentUser() user: any,
    @Body() dto: ReceiptDto,
  ) {
    return await this.regService.submitServiceUpgradeOrRenewal(
      attachment,
      user,
      dto,
      ServiceKeyEnum.REGISTRATION_UPGRADE,
      "Registration Upgrade Application"
    );
  }

  @Post('renew-service')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('attachmentUrl'))
  async renewService(
    @UploadedFile() attachment: Express.Multer.File,
    @CurrentUser() user: any,
    @Body() dto: ReceiptDto,
  ) {
    return await this.regService.submitServiceUpgradeOrRenewal(
      attachment,
      user,
      dto,
      ServiceKeyEnum.REGISTRATION_RENEWAL,
      "Registration Renewal Application"
    );
  }

  @Get('get-my-approved-services')
  async getMyApprovedService(@CurrentUser() userInfo: any) {
    return await this.regService.getMyApprovedService(userInfo);
  }
  @Get('get-my-draft-reg-services')
  async getMyDraftedService(@CurrentUser() user: any) {
    return await this.regService.getmyDraftServices(
      ServiceKeyEnum.NEW_REGISTRATION,
      user,
    );
  }

  @Get('cancel-registration')
  async cancelRegistration(@CurrentUser() user: any) {
    return await this.regService.cancelRegistration(user);
  }

  @Get('get-all-business-area')
  async getAllBusinessAreasByUserId(@CurrentUser() userInfo: any) {
    return await this.regService.getAllBusinessAreasByUserId(userInfo.id);
  }
  //profile informationget-my-approved-services
  @Get('get-vendor-information')
  async getVendorInformation(@CurrentUser() userInfo: any) {
    return await this.regService.getVendorInformation(userInfo.id);
  }
  //draft profile update  data
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
  //submit profile update request
  @Post('submit-vendor-update-information')
  async submitProfileUpdateRequest(
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
  //for testing purpose # document generation
  @Post('submit-registration-request')
  async submitRegistrationRequest(
    @CurrentUser() user: string,
    @Res() res: any,
  ) {



    const data2 = {
      "tenantId": 0,
      "createdAt": "2024-04-26T06:54:32.528Z",
      "updatedAt": "2024-04-26T07:03:05.413Z",
      "deletedAt": null,
      "id": "7ba7a718-e449-41e8-b063-3793743f4041",
      "userId": "c6dfab3b-015c-4cc0-965f-62f7f8f12c19",
      "tinNumber": "11000067",
      "status": "Submit",
      "initial": {
        "level": "Submit",
        "status": "Submit",
        "userId": "c6dfab3b-015c-4cc0-965f-62f7f8f12c19",
        "issueDate": "2024-04-26",
        "isPPDARegistered": false
      },
      upgrades: [
        {
          category: 'Goods',
          approvedAt: "2024-04 - 30T05: 35: 51.290Z",
          expireDate: "2025-04 - 26T15: 59: 55.060Z",
          proposedPriceRange: 'Above MK10 million  - MK30 million',
          previousPriceRange: 'Above MK30 million  - MK80 million'
        },
        {
          category: 'Goods',
          approvedAt: "2024-04 - 30T05: 35: 51.290Z",
          expireDate: "2025-04 - 26T15: 59: 55.060Z",
          proposedPriceRange: 'Above MK80 million  - MK100 million',
          previousPriceRange: 'Above MK30 million  - MK80 million'
        },
        {
          category: 'Goods',
          approvedAt: "2024-04 - 30T05: 35: 51.290Z",
          expireDate: "2025-04 - 26T15: 59: 55.060Z",
          proposedPriceRange: 'Above MK80 million  - MK100 million',
          previousPriceRange: 'Above MK30 million  - MK80 million'
        },
        {
          category: 'Goods',
          approvedAt: "2024-04 - 30T05: 35: 51.290Z",
          expireDate: "2025-04 - 26T15: 59: 55.060Z",
          proposedPriceRange: 'Above MK80 million  - MK100 million',
          previousPriceRange: 'Above MK30 million  - MK80 million'
        },
        {
          category: 'Goods',
          approvedAt: "2024-04 - 30T05: 35: 51.290Z",
          expireDate: "2025-04 - 26T15: 59: 55.060Z",
          proposedPriceRange: 'Above MK80 million  - MK100 million',
          previousPriceRange: 'Above MK30 million  - MK80 million'
        },
        {
          category: 'Goods',
          approvedAt: "2024-04 - 30T05: 35: 51.290Z",
          expireDate: "2025-04 - 26T15: 59: 55.060Z",
          proposedPriceRange: 'Above MK80 million  - MK100 million',
          previousPriceRange: 'Above MK30 million  - MK80 million'
        },
      ]
      ,
      "basic": {
        "name": "MBRS BUSINESS NAME",
        "status": "Draft",
        "address": {
          "postalAddress": "MBRS POSTAL ADDRESS",
          "physicalAddress": "MBRS PHYSICAL ADDRESS"
        },
        "tinNumber": "11000067",
        "businessType": "partnership",
        "tinIssuedDate": "2024-04-26",
        "registrationNumber": "1234567",
        "countryOfRegistration": "Malawi",
        "registrationIssuedDate": "2024-04-26"
      },
      "address": {
        "fax": "21341234",
        "region": "dd8fbf0a-a737-4751-9627-b468b1e9887f",
        "website": "https://dev.megp.peragosystems.com",
        "district": "76746f34-345a-45f4-b62f-2442ff044e5f",
        "telephone": "32423412341",
        "primaryEmail": "deme111@gmsil.com",
        "postalAddress": "MBRS POSTAL ADDRESS",
        "alternateEmail": "deme1@gmsil.com",
        "physicalAddress": "MBRS PHYSICAL ADDRESS"
      },
      "contactPersons": [
        {
          "email": "admin@admin.com",
          "lastName": "Mergia",
          "firstName": "Demeke ",
          "mobileNumber": "0941234126"
        }
      ],
      "businessSizeAndOwnership": {
        "ownershipType": "",
        "paidUpCapital": {
          "amount": "3,333",
          "currency": "ETB"
        },
        "numberOfEmployees": "67",
        "registeredCapital": {
          "amount": "452,324",
          "currency": "ETB"
        }
      },
      "beneficialOwnershipShareholders": [
        {
          "share": 67,
          "lastName": "Mergia",
          "firstName": "Demeke ",
          "middleName": "Getaneh",
          "nationality": "Afghanistan",
          "votingRights": 56,
          "countryOfResidence": "Åland Islands",
          "authorityToAppointGov": true
        }
      ],
      "bankAccountDetails": [
        {
          "IBAN": "345234",
          "bankId": "56e1a7b0-622d-4bf0-9a95-8ce22cfa3d2b",
          "status": "",
          "bankName": "Ecobank Malawi",
          "bankType": "International",
          "currency": "EUR",
          "hashValue": "",
          "isDefualt": true,
          "swiftCode": "3452345",
          "branchName": "3452345",
          "accountType": "Current",
          "accountNumber": "4523452345",
          "branchAddress": "452345234",
          "accountHolderFullName": "xxxxvvvv"
        }
      ],
      "areasOfBusinessInterest": [
        {
          "category": "Goods",
          "priceRange": "aa4da85e-39fb-42c1-8808-2a06767f3ae9",
          "classification": null,
          "lineOfBusiness": []
        }
      ],
      "lineOfBusiness": [
        {
          "id": "ef5009b0-329f-40d7-baa9-37de96a2f5d0",
          "name": "Live Plant and Animal Material and Accessories and Supplies"
        },
        {
          "id": "a2f52b53-f286-4e99-bd3c-882fc0041eab",
          "name": "Chemicals including Bio Chemicals and Gas Materials"
        }
      ],
      "invoice": {},
      "supportingDocuments": {
        "mRA_TPINCertificate": "",
        "mRATaxClearanceCertificate": "",
        "generalReceipt_BankDepositSlip": "",
        "previousPPDARegistrationCertificate": "",
        "businessRegistration_IncorporationCertificate": "1714114963088-903263000_1.png"
      },
      "paymentReceipt": {
        "attachment": "1714114917087-282453256_1.png",
        "invoiceIds": [
          "388b2e0d-9107-4dde-b285-211ffd5ca292"
        ],
        "transactionId": "452345"
      },
      "remark": null,
      "registrationNumber": null,
      "businessAreas": [],
      "areasOfBusinessInterestView": [
        {
          "category": "Goods",
          "priceRange": "Above MK10 million  - MK30 million",
          "lineOfBusiness": []
        }
      ]
      // renewals: [
      //   // {
      //   //   "category": "Goods",
      //   //   "approvedAt": "2024-04-29",
      //   //   "expireDate": "2025-04-29",
      //   //   "previousPriceRange": "Above 80MK",

      //   // }

      // ]
      ,
      "preferential": [
        {
          "tenantId": 0,
          "createdAt": "2024-04-26T07:01:35.446Z",
          "updatedAt": "2024-04-26T07:01:35.446Z",
          "deletedAt": null,
          "id": "5eed3d4b-5e9b-463d-91f5-2b70ec27dda3",
          "serviceId": "26ff8e51-0f68-9c28-2ea4-a32a5e1f184f",
          "userId": "c6dfab3b-015c-4cc0-965f-62f7f8f12c19",
          "certificateUrl": null,
          "certiNumber": "23421451245",
          "category": "ibm",
          "type": "ibm",
          "certificateValidityPeriod": "2024-04-18T21:00:00.000Z",
          "certificateIssuedDate": "2024-04-25T21:00:00.000Z",
          "status": "Draft",
          "service": {
            "tenantId": 0,
            "createdAt": "2024-04-17T06:39:55.386Z",
            "updatedAt": "2024-04-17T06:39:55.386Z",
            "deletedAt": null,
            "id": "26ff8e51-0f68-9c28-2ea4-a32a5e1f184f",
            "name": "IBM",
            "key": "IBM",
            "description": null,
            "isActive": true
          }
        }
      ]
    }
    delete data2.basic.address;
    const result = await this.regService.generatePDFForReview(data2, user, "Test data");
    // res.set({
    //   'Content-Type': 'application/pdf',
    //   'Content-Disposition': 'attachment; filename="document.pdf"',
    // });
    // result.pipe(res);
    return res.end(result);
  }

  @Post('event-test')
  testEvent() {
    return this.regService.testEvent();
  }
}

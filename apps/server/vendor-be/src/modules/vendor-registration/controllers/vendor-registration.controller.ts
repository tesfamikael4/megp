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
    const data = {
      "id": "776e178a-78ef-4c41-afaf-83dd60fc2496",
      "basic": {
        "name": "Submit Test",
        "status": "Draft",
        "tinNumber": "12345665",
        "businessType": "partnership",
        "tinIssuedDate": "2024-04-18",
        "registrationNumber": "",
        "countryOfRegistration": "Lithuania",
        "registrationIssuedDate": ""
      },
      "remark": null,
      "status": "Submit",
      "userId": "f17599e1-41aa-4213-bfd5-bf29b3944681",
      "address": {
        "fax": "",
        "website": "",
        "telephone": "0987652321",
        "mobilePhone": "",
        "primaryEmail": "asdf@gmail.com",
        "postalAddress": "asdf",
        "alternateEmail": "asdfa@gmail.com",
        "physicalAddress": "asdfa"
      },
      "initial": {
        "level": "Submit",
        "status": "Submit",
        "userId": "f17599e1-41aa-4213-bfd5-bf29b3944681",
        "issueDate": "2024-04-18",
        "isPPDARegistered": false
      },
      "invoice": {

      },
      "tenantId": 0,
      "createdAt": "2024-04-18T11:34:47.020Z",
      "deletedAt": null,
      "tinNumber": "12345665",
      "updatedAt": "2024-04-18T11:37:54.945Z",
      "documentId": "",
      "preferential": [
        {
          "type": "ibm",
          "category": "ibm",
          "serviceId": "26ff8e51-0f68-9c28-2ea4-a32a5e1f184f",
          "certiNumber": "asdfa",
          "certificateUrl": null
        }
      ],
      "businessAreas": [

      ],
      "contactPersons": [
        {
          "email": "wteffera11@gmail.com",
          "lastName": "test",
          "firstName": "asdf",
          "mobileNumber": "0987654321"
        }
      ],
      "lineOfBusiness": [
        {
          "id": "ef5009b0-329f-40d7-baa9-37de96a2f5d0",
          "name": "Live Plant and Animal Material and Accessories and Supplies"
        },
        {
          "id": "4b01d8f7-db5b-4784-86ba-94b5c243441d",
          "name": "Mineral and Textile and Inedible Plant and Animal Materials"
        }
      ],
      "paymentReceipt": {
        "attachment": "1713440231232-146971234_14535c4c-c9cf-4411-acf9-bab43ddca8ec.pdf",
        "invoiceIds": [
          "884a557e-a33b-4f01-b53f-98c63c5e1cbe"
        ],
        "transactionId": "asdfasdfassad233"
      },
      "bankAccountDetails": [
        {
          "IBAN": "asdfa",
          "bankId": "",
          "status": "",
          "bankName": "asdfa",
          "bankType": "International",
          "currency": "USD",
          "hashValue": "",
          "isDefualt": true,
          "swiftCode": "asdfas",
          "branchName": "ASDFA",
          "accountType": "Saving",
          "accountNumber": "23423",
          "branchAddress": "asdfasdf",
          "accountHolderFullName": "ASDFA"
        }
      ],
      "registrationNumber": null,
      "supportingDocuments": {
        "mRA_TPINCertificate": "",
        "mRATaxClearanceCertificate": "",
        "generalReceipt_BankDepositSlip": "",
        "previousPPDARegistrationCertificate": "",
        "businessRegistration_IncorporationCertificate": "1713440272983-917932994_14535c4c-c9cf-4411-acf9-bab43ddca8ec.pdf"
      },
      "areasOfBusinessInterest": [
        {
          "category": "Goods",
          "priceRange": "Up to MK10 million",
          "lineOfBusiness": [

          ]
        }
      ],
      "businessSizeAndOwnership": {
        "ownershipType": "",
        "paidUpCapital": {
          "amount": "98,765",
          "currency": "USD"
        },
        "numberOfEmployees": "23423",
        "registeredCapital": {
          "amount": "123,456,789",
          "currency": "USD"
        }
      },
      "areasOfBusinessInterestView": [
        {
          "category": "Goods",
          "priceRange": "Up to MK10 million",
          "lineOfBusiness": [

          ]
        }
      ],
      "beneficialOwnershipShareholders": [
        {
          "share": 70,
          "lastName": "test",
          "firstName": "asdf",
          "middleName": "Teferaasdf",
          "nationality": "Algeria",
          "votingRights": 100,
          "countryOfResidence": "Åland Islands",
          "authorityToAppointGov": ""

        }
      ]
    }


    const data2 = {
      "vendor": {
        "id": "850a9f47-81a8-4eb6-9254-96bc90902caa",
        "basic": {
          "name": "Terrastone Construction Limited44-b",
          "level": "detail",
          "origin": "Malawi",
          "status": "Draft",
          "district": "Chiradzulu",
          "tinNumber": "222222221",
          "businessType": "privateLimitedCompany",
          "tinIssuedDate": "2024-04-04"
        },
        "remark": null,
        "status": "Approved",
        "userId": "bd1a4b88-3015-4663-bbd3-bba11ccb5d98",
        "address": {
          "fax": "+345234",
          "website": "https://dev.megp.peragosystems.com",
          "telephone": "+5234523452345",
          "mobilePhone": "0909090909",
          "primaryEmail": "dfasdfas@asdfasdf.cc",
          "postalAddress": "12312342",
          "alternateEmail": "deme1@gmsil.com"
        },
        "initial": {
          "level": "doc",
          "status": "Save",
          "userId": "bd1a4b88-3015-4663-bbd3-bba11ccb5d98",
          "issueDate": "2024-04-04"
        },
        "invoice": {

        },
        "tenantId": 0,
        "createdAt": "2024-04-04T13:07:08.844Z",
        "deletedAt": null,
        "tinNumber": "222222221",
        "updatedAt": "2024-04-04T14:23:37.667Z",
        "shareHolders": [
          {
            "share": 67,
            "lastName": "Getaneh",
            "firstName": "Demeke ",
            "nationality": "Åland Islands"
          }
        ],
        "contactPersons": [
          {
            "email": "demekeg@wldu.edu.et",
            "lastName": "Mergia",
            "firstName": "Demeke ",
            "mobileNumber": "0941234126"
          }
        ],
        "lineOfBusiness": ['Ecobank Malawi', 'Ecobank Malawi 2'],
        "paymentReceipt": {
          "invoiceId": "[\"f4b06506-a017-41c6-8d9c-28a647446e98\"]",
          "attachment": "1712240617496-434064850_certeficate.png",
          "transactionNumber": "452345325452"
        },
        "bankAccountDetails": [
          {
            "IBAN": "234523",
            "bankId": "56e1a7b0-622d-4bf0-9a95-8ce22cfa3d2b",
            "status": "",
            "bankName": "Ecobank Malawi",
            "currency": "ETB",
            "bankSwift": "2345234",
            "hashValue": "",
            "isDefualt": true,
            "branchName": "23452345",
            "accountType": "",
            "accountNumber": "452345234",
            "branchAddress": "34523",
            "accountHolderFullName": "ServiceKeyEnum.REGISTRATION_RENEWAL"
          }
        ],
        "beneficialOwnershipAndShares": [
          {
            "lastName": "Mergia",
            "middleName": "",
            "firstName": "Demeke ",
            "nationality": "Åland Islands",
            "share": "",
            "countryOfResidence": "",
            "votingRights": "",
            "authorityToAppointGov": "",
          }
        ],
        "supportingDocuments": {
          "mRA_TPINCertificate": "",
          "mRATaxClearanceCertificate": "",
          "generalReceipt_BankDepositSlip": "",
          "previousPPDARegistrationCertificate": "",
          "businessRegistration_IncorporationCertificate": ""
        },
        "areasOfBusinessInterest": [
          {
            "category": "Goods",
            "priceRange": "uto 100MK",
            "lineOfBusiness": [
              {
                "id": "641a3198-42ab-f65a-a8df-7005f7f4cb46",
                "name": "Office equipment"
              }
            ]
          }
        ],
        "businessSizeAndOwnership": {
          "ownershipType": "Malawian",
          "paidUpCapital": {
            "amount": "456",
            "currency": "KW"
          },
          "numberOfEmployees": "67",
          "registeredCapital": {
            "amount": "45,232,999",
            "currency": "KW"
          }
        }
      },
      "preferential": [
        {
          'category': '',
          'type': 'Micro Interprize',
          "certiNumber": "er451425123451",
          'certificateIssuanceDate': '',
          'certificateValidityPeriod': '',
          "status": "Submitted",
          "userId": "bd1a4b88-3015-4663-bbd3-bba11ccb5d98",

        },
        {
          'category': '',
          'type': 'IBM',
          "certiNumber": "er451425123451",
          'certificateIssuanceDate': '',
          'certificateValidityPeriod': '',
          "status": "Submitted",
          "userId": "bd1a4b88-3015-4663-bbd3-bba11ccb5d98",

        },
        {
          'category': '',
          'type': 'Marginalized',
          "certiNumber": "er451425123451",
          'certificateIssuanceDate': '',
          'certificateValidityPeriod': '',
          "status": "Submitted",
          "userId": "bd1a4b88-3015-4663-bbd3-bba11ccb5d98",

        }
      ]
    };
    const result = await this.regService.generatePDFForReview(data, user);
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

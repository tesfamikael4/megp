import { Injectable } from '@nestjs/common';
import { CustomerBussinesInfoService } from 'src/modules/customer-bussines-info/services/customer-bussines-info.service';
import { FppaVendorService } from 'src/modules/fppa-vendor/services/fppa-vendor.service';
import { NcicVendorsService } from 'src/modules/ncic-vendors/services/ncic-vendors.service';
import { TccDocumentValidationService } from 'src/modules/tcc-document-validation/services/tcc-document-validation.service';

@Injectable()
export class ScheduleService {
  constructor(
    private readonly _fppaVendorService: FppaVendorService,
    private readonly _ncicVendorsService: NcicVendorsService,
    private readonly _customerBussinesInfoService: CustomerBussinesInfoService,
    // private readonly _taxPayerService: TaxPayerService,
    private readonly _tccDocumentVerification: TccDocumentValidationService,
  ) {}
  // @Cron(CronExpression.EVERY_10_SECONDS)
  async fetchTaxPayerFromAPI() {
    // await this._taxPayerService.fetchTaxPayerFromJsonFile();
  }
  //@Cron(CronExpression.EVERY_10_SECONDS)
  async fetchCustomerFromAPI() {
    await this._customerBussinesInfoService.fetchCustomerFromJsonFile();
  }
  //@Cron(CronExpression.EVERY_10_SECONDS)
  async fetchFPPAVendorFromAPI() {
    await this._fppaVendorService.fetchFPPAVendorsFromJsonFile();
  }

  //@Cron(CronExpression.EVERY_10_SECONDS)
  async fetchNCICVendorsFromExternalAPI() {
    await this._ncicVendorsService.fetchNCICVendorsFromJsonFile();
  }
  // @Cron(CronExpression.EVERY_10_SECONDS)
  async fetchNCICVendorsFromAPI4() {
    const tccDecument = '30161301900060';
    await this._tccDocumentVerification.getTaxpayerCertificateByValidationCode(
      tccDecument,
    );
  }
}

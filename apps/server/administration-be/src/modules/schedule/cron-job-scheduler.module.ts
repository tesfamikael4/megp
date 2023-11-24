import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { TccDocumentValidationModule } from 'src/modules/tcc-document-validation/tcc-document-validation.module';
import { CustomerBussinesInfoModule } from 'src/modules/customer-bussines-info/customer-bussines-info.module';
import { FppaVendorModule } from 'src/modules/fppa-vendor/fppa-vendor.module';
import { NcicVendorsModule } from 'src/modules/ncic-vendors/ncic-vendors.module';
// import { TaxPayerModule } from 'src/modules/tax-payer/tax-payer.module';

@Module({
  imports: [
    FppaVendorModule,
    NcicVendorsModule,
    // TaxPayerModule,
    CustomerBussinesInfoModule,
    TccDocumentValidationModule,
  ],
  providers: [ScheduleService],
  exports: [ScheduleService],
})
export class CronJobSchedulerModule {}

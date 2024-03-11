import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { ItemMasterModule } from './modules/item-master/item-master.module';
import { lookUpDataModule } from './modules/look-up-data/look-up.module';
import { ClassificationModule } from './modules/classification/classification.module';
import { AuthorizationModule } from './shared/authorization/authorization.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BudgetCategoriesModule } from './modules/budget-categories/budget-categories.module';
import { CustomerBussinesInfoModule } from './modules/customer-bussines-info/customer-bussines-info.module';
import { FppaVendorModule } from './modules/fppa-vendor/fppa-vendor.module';
import { NcicVendorsModule } from './modules/ncic-vendors/ncic-vendors.module';
import { CronJobSchedulerModule } from './modules/schedule/cron-job-scheduler.module';
import { TaxPayerModule } from './modules/tax-payer/tax-payer.module';
import { TccDocumentValidationModule } from './modules/tcc-document-validation/tcc-document-validation.module';
import { ProcurementThresholdModule } from './modules/procurement-threshold/procurement-threshold.module';
import { OrganizationBudgetCategoryModule } from './modules/organization-budget-category/organization-budget-category.module';
import { GuaranteeServiceModule } from './modules/guarantee-services/guarantee-service.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    ClassificationModule,
    lookUpDataModule,
    ItemMasterModule,
    AuthorizationModule,
    TaxPayerModule,
    CustomerBussinesInfoModule,
    TccDocumentValidationModule,
    FppaVendorModule,
    NcicVendorsModule,
    ScheduleModule.forRoot(),
    CronJobSchedulerModule,
    BudgetCategoriesModule,
    ProcurementThresholdModule,
    OrganizationBudgetCategoryModule,
    GuaranteeServiceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

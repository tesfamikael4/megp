import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { VendorRegistrationModule } from './modules/vendor-registration/vendor-registration.module';
import { AuthorizationModule } from './shared/authorization';
import { CategoriesModule } from './modules/categories/category.module';
import { BpmModule } from './modules/bpm/bpm.module';
import { ServiceModule } from './modules/services/service.module';
import { ServicePricingModule } from './modules/pricing/pricing.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailConfig } from './shared/email/email.config';
import { CertificateModule } from './modules/certificates/certificate.module';
import { NotificationModule } from './modules/notifications/notification.module';
import { PreferentialTreatmentModule } from './modules/preferentials/preferencial-treatment.module';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    MailerModule.forRootAsync({ useClass: EmailConfig }),
    AuthorizationModule,
    CategoriesModule,
    VendorRegistrationModule,
    ServiceModule,
    ServicePricingModule,
    BpmModule,
    CertificateModule,
    NotificationModule,
    PreferentialTreatmentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

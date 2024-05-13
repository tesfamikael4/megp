import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailConfig } from './shared/email/email.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { OrganizationModule } from './modules/organization';
import { ApplicationModule } from './modules/application/application.module';
import { GroupModule } from './modules/groups/group.module';
import { MandateModule } from './modules/mandate/mandate.module';
import { RoleModule } from './modules/role/role.module';
import { AuthorizationModule } from './shared/authorization/authorization.module';
import { AccountModule } from './modules/account/account.module';
import { DataSeeder } from './modules/seeders/data.seeder';
import { RoleSystemModule } from './modules/role-system/role-system.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TenantInterceptor, TransactionInterceptor } from '@interceptors';
import { ProcurementInstitutionModule } from './modules/procurement-institution/procurement-institution.module';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    MailerModule.forRootAsync({ useClass: EmailConfig }),
    GoogleRecaptchaModule.forRoot({
      secretKey:
        process.env.GOOGLE_RECAPTCHA_SECRET_KEY ??
        '6LcizbgpAAAAAIzyLr6PyflbnOYWz5GfxgJZ6onD',
      response: (req) => req.body.gReCaptchaToken,
      skipIf: true, // process.env.NODE_ENV !== 'production',
      score: 0.8,
      debug: process.env.NODE_ENV == 'development',
    }),
    AuthorizationModule,
    AccountModule,
    OrganizationModule,
    GroupModule,
    RoleModule,
    ApplicationModule,
    MandateModule,
    RoleSystemModule,
    ProcurementInstitutionModule,
  ],
  controllers: [],
  providers: [
    DataSeeder,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransactionInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TenantInterceptor,
    },
  ],
})
export class AppModule {}

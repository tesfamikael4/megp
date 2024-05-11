import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AuthorizationModule,
  TenantInterceptor,
  TransactionInterceptor,
  TypeOrmConfigService,
} from 'megp-shared-be';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { EmailConfig } from 'megp-shared-be';
import { MailerModule } from '@nestjs-modules/mailer';
import { RfxModule } from './modules/rfx/rfx.module';
import { SolicitationModule } from './modules/solicitation/solicitation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    MailerModule.forRootAsync({ useClass: EmailConfig }),
    AuthorizationModule,
    RfxModule,
    SolicitationModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransactionInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TenantInterceptor,
    },
  ],
  controllers: [],
})
export class AppModule {}

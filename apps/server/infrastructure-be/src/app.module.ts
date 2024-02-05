import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowModule } from './modules/workflow/workflow.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { DataSeeder } from './modules/seeders/data.seeder';
import { MailerModule } from '@nestjs-modules/mailer';
import { RuleModule } from './modules/rule/rule.module';
import { NotificationModule } from './modules/notification/notification.module';
import {
  TypeOrmConfigService,
  EmailConfig,
  AuthorizationModule,
  TransactionInterceptor,
  TenantInterceptor,
} from '@megp/shared-be';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    MailerModule.forRootAsync({ useClass: EmailConfig }),
    AuthorizationModule,
    WorkflowModule,
    RuleModule,
    NotificationModule,
  ],
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
  controllers: [],
})
export class AppModule {}

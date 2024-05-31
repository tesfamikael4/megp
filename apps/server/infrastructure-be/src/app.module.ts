import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from 'megp-shared-be';
import { AuthorizationModule } from 'megp-shared-be';
import { WorkflowModule } from './modules/workflow/workflow.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TenantInterceptor, TransactionInterceptor } from 'megp-shared-be';
import { EmailConfig } from 'megp-shared-be';
import { DataSeeder } from './modules/seeders/data.seeder';
import { MailerModule } from '@nestjs-modules/mailer';
import { RuleModule } from './modules/rule/rule.module';
import { NotificationModule } from './modules/notification/notification.module';
import { NotesModule } from './modules/notes-be/notes.module';
import { PaymentGatewayModule } from './modules/payment-gateway/payment-gateway.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    MailerModule.forRootAsync({ useClass: EmailConfig }),
    AuthorizationModule,
    WorkflowModule,
    RuleModule,
    NotificationModule,
    NotesModule,
    PaymentGatewayModule,
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

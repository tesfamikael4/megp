import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { AuthorizationModule } from './shared/authorization/authorization.module';
import { WorkflowModule } from './modules/workflow/workflow.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import {
  TenantInterceptor,
  TransactionInterceptor,
} from './shared/interceptors';
import { EmailConfig } from './shared/email/email.config';
import { DataSeeder } from './modules/seeders/data.seeder';
import { MailerModule } from '@nestjs-modules/mailer';
import { RuleModule } from './modules/rule/rule.module';
import { NotificationModule } from './modules/notification/notification.module';

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

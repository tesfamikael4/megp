import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AuthorizationModule,
  TenantInterceptor,
  TransactionInterceptor,
  TypeOrmConfigService,
} from 'megp-shared-be';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TenderNoticeModule } from './modules/tender-notice/tender-notice.module';
import { RabbitMqErrorModule } from './modules/rabbit-mq-errors/rabbit-mq-error.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    AuthorizationModule,
    TenderNoticeModule,
    RabbitMqErrorModule,
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

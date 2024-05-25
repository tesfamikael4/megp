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

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    AuthorizationModule,
    TenderNoticeModule,
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

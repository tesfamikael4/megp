import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AuthorizationModule,
  TenantInterceptor,
  TransactionInterceptor,
  TypeOrmConfigService,
} from 'megp-shared-be';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RfxModule } from './modules/rfx/rfx.module';
import { SolicitationModule } from './modules/solicitation/solicitation.module';
import { EvaluationModule } from './modules/evaluation/evaluation.module';
import { AwardModule } from './modules/award/award.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    AuthorizationModule,
    RfxModule,
    SolicitationModule,
    EvaluationModule,
    AwardModule,
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

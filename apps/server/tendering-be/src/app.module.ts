import { DocxModule } from './shared/docx/docx.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { AuthorizationModule } from './shared/authorization/authorization.module';
import { SpdModule } from './modules/spd/spd.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TenderModule } from './modules/tenders/tender.module';
import { EqcModule } from './modules/eqc/eqc.module';
import { BdsModule } from './modules/bds/bds.module';
import { SorModule } from './modules/sor/sor.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransactionInterceptor } from './shared/interceptors';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    DocxModule,
    AuthorizationModule,
    SpdModule,
    TenderModule,
    EqcModule,
    BdsModule,
    SorModule,
  ],
  providers: [
    EventEmitterModule,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransactionInterceptor,
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: TenantInterceptor,
    // },
  ],
  controllers: [],
})
export class AppModule {}

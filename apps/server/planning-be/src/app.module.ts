import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { AuthorizationModule } from './shared/authorization/authorization.module';
import { APPModule } from './modules/planning/app.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransactionInterceptor } from './shared/interceptors';
import { TenantInterceptor } from './shared/interceptors/tenant-interceptor';
import { UtilityModule } from './modules/utility/utility.module';
import { MinIOModule } from './shared/min-io/min-io.module';
import { ProcurementRequisitionModule } from './modules/procurement-requistion/procurement-requisition.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    AuthorizationModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthorizationModule,
    APPModule,
    MinIOModule,
    UtilityModule,
    ProcurementRequisitionModule,
    EventEmitterModule.forRoot({
      // set this to `true` to use wildcards
      wildcard: false,
      // the delimiter used to segment namespaces
      delimiter: '.',
      // set this to `true` if you want to emit the newListener event
      newListener: false,
      // set this to `true` if you want to emit the removeListener event
      removeListener: false,
      // the maximum amount of listeners that can be assigned to an event
      maxListeners: 10,
      // show event name in memory leak message when more than maximum amount of listeners is assigned
      verboseMemoryLeak: false,
      // disable throwing uncaughtException if an error event is emitted and it has no listeners
      ignoreErrors: false,
    }),
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

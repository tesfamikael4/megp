import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { AuthorizationModule } from './shared/authorization/authorization.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ProcurementRequisitionModule } from './modules/procurement-requistion/procurement-requisition.module';
@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    AuthorizationModule,
    ProcurementRequisitionModule,
  ],
  providers: [EventEmitterModule],
  controllers: [],
})
export class AppModule {}

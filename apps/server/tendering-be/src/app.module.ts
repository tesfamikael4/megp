import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { AuthorizationModule } from './shared/authorization/authorization.module';
import { ProcurementRequisitionModule } from './modules/ProcurementRequistion/procurement-requisition.module';
import { PostBudgetPlanModule } from './modules/post-budget-plan/post-budget-planmodule';
import { SpdModule } from './modules/spd/spd.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
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
    PostBudgetPlanModule,
    SpdModule,
  ],
  providers: [EventEmitterModule],
  controllers: [],
})
export class AppModule {}

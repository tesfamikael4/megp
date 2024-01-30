import { DocxModule } from './shared/docx/docx.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { AuthorizationModule } from './shared/authorization/authorization.module';
import { PostBudgetPlanModule } from './modules/post-budget-plan/post-budget-planmodule';
import { SpdModule } from './modules/spd/spd.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AnnualProcurementPlanModule } from './modules/annual-procurement-plan/annual-procurement-plan.module';
import { ProcurementRequisitionModule } from './modules/procurement-requistion/procurement-requisition.module';
@Module({
  imports: [
    DocxModule,
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
    AnnualProcurementPlanModule,
  ],
  providers: [EventEmitterModule],
  controllers: [],
})
export class AppModule {}

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
import { ClientsModule, Transport } from '@nestjs/microservices';
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

    ClientsModule.register([
      {
        name: 'PR_RMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RMQ_URL],
          queue: 'pr-work-plan-initiate',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
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

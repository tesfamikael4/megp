import { DocxModule } from './shared/docx/docx.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { AuthorizationModule } from './shared/authorization/authorization.module';
import { TransactionInterceptor } from './shared/interceptors';
import { SpdModule } from './modules/spd/spd.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TenderModule } from './modules/tenders/tender.module';
import { EqcModule } from './modules/eqc/eqc.module';
import { BdsModule } from './modules/bds/bds.module';
import { SorModule } from './modules/sor/sor.module';
import { BidModule } from './modules/bid/bid.module';
import { SccModule } from './modules/scc/scc.module';
import { OpeningModule } from './modules/opening/opening.module';
import { TeamModule } from './modules/team/team.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TenantInterceptor } from './shared/interceptors/tenant-interceptor';
import { EvaluationModule } from './modules/technical-evaluation/technical-evaluation.module';
import { BiddersComparisonModule } from './modules/bidders/bidders-comparison.module';
import { ExchangeRateModule } from './modules/utility/exchange-rate/exchange-rate.module';
import { FormulaModule } from './modules/utility/formula/formula.module';
import { FinancialEvaluationModule } from './modules/financial-evaluation/financial-evaluation.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

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
    BidModule,
    SccModule,
    OpeningModule,
    TeamModule,
    EvaluationModule,
    BiddersComparisonModule,
    ExchangeRateModule,
    FormulaModule,
    FinancialEvaluationModule,
    ClientsModule.register([
      {
        name: 'ERROR_LOG_RMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RMQ_URL],
          queue: 'rabbit-mq-error-log',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  providers: [
    EventEmitterModule,
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

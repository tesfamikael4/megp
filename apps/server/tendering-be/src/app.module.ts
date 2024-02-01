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
import { MinioModule } from 'nestjs-minio-client';
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
        name: process.env.RMQ_NAME ?? 'APP_RMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RMQ_URL],
          queue: process.env.RMQ_QUEUE ?? 'create_app',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    MinioModule.register({
      endPoint: process.env.MINIO_ENDPOINT ?? 'files.megp.peragosystems.com',
      port: Number(process.env.MINIO_PORT ?? 80),
      useSSL: Boolean(process.env.MINIO_USESSL ?? false),
      accessKey: process.env.MINIO_ACCESSKEY ?? 'Szzt6Zo5yEJCfa7ay5sy',
      secretKey:
        process.env.MINIO_SECRETKEY ??
        'dGtjFGcLjKU6pXRYx1tOnqGeycJtxJoavgwqYgDd',
    }),
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

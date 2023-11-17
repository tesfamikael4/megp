import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { AuthorizationModule } from './shared/authorization/authorization.module';
import { ProcurementRequisitionModule } from './modules/ProcurementRequistion/procurement-requisition.module';
import { PostBudgetPlanModule } from './modules/post-budget-plan/post-budget-planmodule';

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
    ProcurementRequisitionModule,
    PostBudgetPlanModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}

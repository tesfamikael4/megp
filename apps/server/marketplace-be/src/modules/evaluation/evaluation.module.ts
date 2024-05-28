import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinIOModule } from 'megp-shared-be';
import { ScheduleModule } from '@nestjs/schedule';
import {
  EvalItemResponse,
  EvalResponse,
  RFX,
  RfxProcurementTechnicalTeam,
  SolRegistration,
  SolRound,
} from 'src/entities';
import { ReSchedulerService } from './services/re-scheduler.service';
import { EncryptionHelperService } from '../../utils/services/encryption-helper.service';
import { UtilityModule } from 'src/utils/utils.module';
import { OpenerSerivice } from './services/opener.service';
import { EvalResponseController } from './controllers/eval-response.controller';
import { EvalResponseService } from './services/eval-response.service';
import { EvalItemResponseService } from './services/eval-item-response.service';
import { EvalItemResponseController } from './controllers/eval-item-response.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SolRound,
      SolRegistration,
      RfxProcurementTechnicalTeam,
      RFX,
      EvalResponse,
      EvalItemResponse,
    ]),
    ScheduleModule.forRoot(),
    MinIOModule,
    UtilityModule,
  ],
  controllers: [EvalResponseController, EvalItemResponseController],
  providers: [
    ReSchedulerService,
    EncryptionHelperService,
    OpenerSerivice,
    EvalResponseService,
    EvalItemResponseService,
  ],
  exports: [OpenerSerivice, ReSchedulerService],
})
export class EvaluationModule {}

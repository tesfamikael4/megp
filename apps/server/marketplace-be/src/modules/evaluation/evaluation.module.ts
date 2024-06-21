import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinIOModule } from 'megp-shared-be';
import { ScheduleModule } from '@nestjs/schedule';
import {
  EvalItemResponse,
  EvalResponse,
  OpenedResponse,
  RFX,
  RfxProcurementTechnicalTeam,
  SolRegistration,
  SolResponse,
  SolRound,
  TeamMember,
} from 'src/entities';
import { ReSchedulerService } from './services/re-scheduler.service';
import { EncryptionHelperService } from '../../utils/services/encryption-helper.service';
import { UtilityModule } from 'src/utils/utils.module';
import { OpenerService } from './services/opener.service';
import { EvalResponseController } from './controllers/eval-response.controller';
import { EvalResponseService } from './services/eval-response.service';
import { EvalItemResponseService } from './services/eval-item-response.service';
import { EvalItemResponseController } from './controllers/eval-item-response.controller';
import { TeamMemberController } from './controllers/team-member.controller';
import { TeamMemberService } from './services/team-member.service';
import { EvalAssessment } from 'src/entities/eval-assessment.entity';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SolRound,
      SolRegistration,
      SolResponse,
      OpenedResponse,
      TeamMember,
      RfxProcurementTechnicalTeam,
      RFX,
      EvalResponse,
      EvalItemResponse,
      EvalAssessment,
    ]),
    ScheduleModule.forRoot(),
    MinIOModule,
    UtilityModule,
    ClientsModule.register([
      {
        name: 'WORKFLOW_EVALUATION_RMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RMQ_URL],
          queue: 'workflow-approval',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    // RabbitMQModule.forRoot(RabbitMQModule, {
    //   exchanges: [
    //     {
    //       name: 'workflow-broadcast-exchanges',
    //       type: 'direct',
    //     },
    //   ],
    //   uri: process.env.RMQ_URL,
    //   enableControllerDiscovery: true,
    // }),
  ],
  controllers: [
    EvalResponseController,
    EvalItemResponseController,
    TeamMemberController,
  ],
  providers: [
    ReSchedulerService,
    EncryptionHelperService,
    OpenerService,
    EvalResponseService,
    EvalItemResponseService,
    TeamMemberService,
  ],
  exports: [OpenerService, ReSchedulerService],
})
export class EvaluationModule {}

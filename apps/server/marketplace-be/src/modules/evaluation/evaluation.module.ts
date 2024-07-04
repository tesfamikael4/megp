import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinIOModule } from 'megp-shared-be';
import { ScheduleModule } from '@nestjs/schedule';
import {
  EvalItemResponse,
  EvalResponse,
  OpenedItemResponse,
  OpenedResponse,
  RFX,
  RfxProcurementTechnicalTeam,
  SolRegistration,
  SolResponse,
  SolRound,
  TeamMember,
  WorkflowItem,
  WorkflowItemDetail,
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
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EvalApproval, EvalApprovalDetail } from '../../entities';
import { EvalApprovalController } from './controllers/eval-approval.controller';
import { EvalApprovalDetailController } from './controllers/eval-approval-detail.controller';
import { EvalApprovalDetailService } from './services/eval-approval-detail.service';
import { EvalApprovalService } from './services/eval-approval.service';
import { WorkflowItemController } from 'src/utils/controllers/workflow-item.controller';
import { WorkflowItemDetailController } from 'src/utils/controllers/workflow-item-detail.controller';
import { WorkflowItemDetailService } from 'src/utils/services/workflow-item-detail.service';
import { WorkflowItemService } from 'src/utils/services/workflow-item.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SolRound,
      SolRegistration,
      SolResponse,
      OpenedResponse,
      OpenedItemResponse,
      TeamMember,
      RfxProcurementTechnicalTeam,
      RFX,
      EvalResponse,
      EvalItemResponse,
      EvalAssessment,
      EvalApproval,
      EvalApprovalDetail,
      WorkflowItemDetail,
      WorkflowItem,
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
          queue: 'workflow-initiate',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [
    EvalResponseController,
    EvalItemResponseController,
    TeamMemberController,
    EvalApprovalController,
    EvalApprovalDetailController,
    WorkflowItemController,
    WorkflowItemDetailController,
  ],
  providers: [
    ReSchedulerService,
    EncryptionHelperService,
    OpenerService,
    EvalResponseService,
    EvalItemResponseService,
    TeamMemberService,
    EvalApprovalService,
    EvalApprovalDetailService,
    WorkflowItemDetailService,
    WorkflowItemService,
  ],
  exports: [OpenerService, ReSchedulerService],
})
export class EvaluationModule {}

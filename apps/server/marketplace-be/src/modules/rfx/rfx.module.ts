import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RFXItem } from 'src/entities/rfx-items.entity';
import { RFX } from 'src/entities/rfx.entity';
import { RfxService } from './services/rfx.service';
import { RFXItemController } from './controllers/rfx-items.controller';
import { RFXItemService } from './services/rfx-items.service';
import { RfxController } from './controllers/rfx.controller';
import {
  RfxBidContractCondition,
  RfxBidProcedure,
  RfxProcurementMechanism,
  RfxProcurementTechnicalTeam,
  RfxItemDocument,
  RfxTechnicalRequirement,
  RfxProductInvitation,
  Document,
  RfxRevisionApproval,
} from 'src/entities';
import { RfxItemDocumentService } from './services/rfx-item-document.service';
import { RfxProcurementMechanismService } from './services/rfx-procurement-mechanism.service';
import { RfxProcurementTechnicalTeamService } from './services/rfx-procurement-technical-team.service';
import { RfxItemDocumentController } from './controllers/rfx-item-document.controller';
import { RfxProcurementMechanismController } from './controllers/rfx-procurement-mechanism.controller';
import { RfxBidProcedureController } from './controllers/rfx-bid-procedure.controller';
import { RfxBidContractConditionController } from './controllers/rfx-bid-contract-condition.controller';
import { RfxBidProcedureService } from './services/rfx-bid-procedure.service';
import { RfxBidContractConditionService } from './services/rfx-bid-contract-condition.service';
import { RfxProcurementTechnicalTeamController } from './controllers/rfx-procurement-technical-team.controller';
import { RfxTechnicalRequirementController } from './controllers/rfx-technical-requirements.controller';
import { RfxTechnicalRequirementService } from './services/rfx-technical-requirement.service';
import { RfxProductInvitationService } from './services/rfx-product-invitation.service';
import { RfxProductInvitationController } from './controllers/rfx-product-invitation.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RfxDocumentaryEvidence } from 'src/entities/rfx-documentary-evidence.entity';
import { RfxDocumentaryEvidenceController } from './controllers/rfx-documentary-evidence.controller';
import { RfxDocumentaryEvidenceService } from './services/rfx-documentary-evidence.service';
import { DocumentController } from 'src/utils/controllers/document.controller';
import { MinIOModule } from 'megp-shared-be';
import { UtilityModule } from 'src/utils/utils.module';
import { RfxRevisionApprovalController } from './controllers/rfx-revision-approval.controller';
import { RfxRevisionApprovalService } from './services/rfx-revision-approval.service';
import { SolicitationModule } from '../solicitation/solicitation.module';
import { WorkflowHandlerService } from './services/workflow-handler.service';
import { WorkflowHandlerController } from './controllers/workflow-handler.controller';
import { OpenerService } from '../evaluation/services/opener.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RFX,
      RfxProcurementTechnicalTeam,
      RFXItem,
      RfxItemDocument,
      RfxProcurementMechanism,
      RfxBidProcedure,
      RfxBidContractCondition,
      RfxTechnicalRequirement,
      RfxProductInvitation,
      RfxDocumentaryEvidence,
      RfxRevisionApproval,
      Document,
    ]),
    MinIOModule,
    UtilityModule,
    SolicitationModule,
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'workflow-broadcast-exchanges',
          type: 'direct',
        },
      ],
      uri: process.env.RMQ_URL,
      enableControllerDiscovery: true,
    }),
  ],
  controllers: [
    RfxController,
    RFXItemController,
    RfxItemDocumentController,
    RfxProcurementMechanismController,
    RfxProcurementTechnicalTeamController,
    RfxBidProcedureController,
    RfxBidContractConditionController,
    RfxTechnicalRequirementController,
    RfxProductInvitationController,
    RfxDocumentaryEvidenceController,
    RfxRevisionApprovalController,
    DocumentController,
    WorkflowHandlerController,
  ],
  providers: [
    RfxService,
    RFXItemService,
    RfxItemDocumentService,
    RfxProcurementMechanismService,
    RfxProcurementTechnicalTeamService,
    RfxBidProcedureService,
    RfxBidContractConditionService,
    RfxTechnicalRequirementService,
    RfxProductInvitationService,
    RfxDocumentaryEvidenceService,
    RfxRevisionApprovalService,
    WorkflowHandlerService,
    OpenerService,
  ],
})
export class RfxModule {}

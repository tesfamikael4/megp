import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocxModule } from 'src/shared/docx/docx.module';
import { MinIOModule } from 'src/shared/min-io/min-io.module';
import {
  Spd,
  SpdOpeningChecklist,
  SpdPreferenceMargin,
  SpdPreliminaryEvaluation,
  SpdProfessionalSetting,
  SpdQualification,
  SpdTechnicalScoring,
  SpdTemplate,
} from 'src/entities';
import {
  SpdService,
  SpdPreferenceMarginService,
  SpdPreliminaryEvaluationService,
  SpdProfessionalSettingService,
  SpdQualificationService,
  SpdTechnicalScoringService,
  SpdTemplateService,
  SpdOpeningChecklistService,
} from './service';
import {
  SpdController,
  SpdPreferenceMarginController,
  SpdPreliminaryEvaluationController,
  SpdProfessionalSettingController,
  SpdQualificationController,
  SpdTechnicalScoringController,
  SpdTemplateController,
} from './controller';
import { FileHelperService } from '../../shared/document-manipulator/file-helper.service';
import { SpdBidFormService } from './service/spd-bid-form.service';
import { SpdBidForm } from 'src/entities/spd-bid-form.entity';
import { SpdBidFormController } from './controller/spd-bid-form.controller';
import { SpdContractForm } from 'src/entities/spd-contract-form.entity';
import { SpdContractFormService } from './service/spd-contract-form.service';
import { SpdContractFormController } from './controller/spd-contract-form.controller';
import { DocumentManipulatorModule } from 'src/shared/document-manipulator/document-manipulator.module';
import { SpdOpeningChecklistController } from './controller/spd-opening-checklist.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Spd,
      SpdPreferenceMargin,
      SpdPreliminaryEvaluation,
      SpdProfessionalSetting,
      SpdQualification,
      SpdTechnicalScoring,
      SpdTemplate,
      SpdBidForm,
      SpdContractForm,
      SpdOpeningChecklist,
    ]),
    DocxModule,
    MinIOModule,
    DocumentManipulatorModule,
  ],
  providers: [
    SpdService,
    SpdPreferenceMarginService,
    SpdPreliminaryEvaluationService,
    SpdProfessionalSettingService,
    SpdQualificationService,
    SpdTechnicalScoringService,
    SpdTemplateService,
    FileHelperService,
    SpdBidFormService,
    SpdContractFormService,
    SpdOpeningChecklistService,
  ],
  controllers: [
    SpdController,
    SpdPreferenceMarginController,
    SpdPreliminaryEvaluationController,
    SpdProfessionalSettingController,
    SpdQualificationController,
    SpdTechnicalScoringController,
    SpdTemplateController,
    SpdBidFormController,
    SpdContractFormController,
    SpdOpeningChecklistController,
  ],
})
export class SpdModule {}

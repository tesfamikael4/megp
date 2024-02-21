import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpdService } from './service/spd.service';
import { SpdController } from './controller/spd.controller';
import { SpdSccService } from './service/spd-scc.service';
import { SpdTechnicalScoringService } from './service/spd-technical-scoring.service';
import { SpdBdsService } from './service/spd-bds.service';
import { SpdBdsController } from './controller/spd-bds.controller';
import { SpdSccController } from './controller/spd-scc.controller';
import { SpdQualificationService } from './service/spd-qualification.service';
import { SpdQualificationController } from './controller/spd-qualification.controller';
import { SpdAdministrativeComplianceService } from './service/spd-administrative-compliance.service';
import { SpdAdministrativeComplianceController } from './controller/spd-administrative-compliance.controller';
import { SpdTechnicalScoringController } from './controller/spd-technical-scoring.controller';
import {
  SpdBds,
  SpdScc,
  SpdTechnicalScoring,
  Spd,
  SpdQualification,
  SpdAdministrativeCompliance,
} from 'src/entities';
import { SpdPreferenceMarginController } from './controller/spd-preference-margin.controller';
import { SpdRequiredDocumentaryEvidencesController } from './controller/spd-required-documentary-evidence.controller';
import { SpdSettingsController } from './controller/spd-setting.controller';
import { SpdPreferenceMargin } from 'src/entities/spd-preference-margin.entity';
import { SpdRequiredDocumentaryEvidence } from 'src/entities/spd-required-documentary-evidence.entity';
import { SpdSetting } from 'src/entities/spd-setting.entity';
import { SpdPreferenceMarginService } from './service/spd-preference-margin.service';
import { SpdRequiredDocumentaryEvidenceService } from './service/spd-required-documentary-evidence.service';
import { SpdSettingService } from './service/spd-setting.service';
import { DocxModule } from 'src/shared/docx/docx.module';
import { MinIOModule } from 'src/shared/min-io/min-io.module';
import { SpdTemplate } from 'src/entities/spd-template.entity';
import { SpdTemplateService } from './service/spd-template.service';
import { SpdTemplateController } from './controller/spd-template.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Spd,
      SpdBds,
      SpdScc,
      SpdQualification,
      SpdAdministrativeCompliance,
      SpdTechnicalScoring,
      SpdPreferenceMargin,
      SpdRequiredDocumentaryEvidence,
      SpdSetting,
      SpdTemplate,
    ]),
    DocxModule,
    MinIOModule,
  ],
  providers: [
    SpdService,
    SpdSccService,
    SpdBdsService,
    SpdQualificationService,
    SpdAdministrativeComplianceService,
    SpdTechnicalScoringService,
    SpdPreferenceMarginService,
    SpdRequiredDocumentaryEvidenceService,
    SpdSettingService,
    SpdTemplateService,
  ],
  controllers: [
    SpdController,
    SpdBdsController,
    SpdSccController,
    SpdQualificationController,
    SpdAdministrativeComplianceController,
    SpdTechnicalScoringController,
    SpdPreferenceMarginController,
    SpdRequiredDocumentaryEvidencesController,
    SpdSettingsController,
    SpdTemplateController,
  ],
})
export class SpdModule {}

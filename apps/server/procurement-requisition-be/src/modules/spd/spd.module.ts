import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpdService } from './service/spd.service';
import { SpdController } from './controller/spd.controller';
import { SpdSccService } from './service/spd-scc.service';
import { SpdTechnicalScoringService } from './service/spd-technical-scoring.service';
import { SpdBdsService } from './service/spd-bds.service';
import { SpdBdsController } from './controller/spd-bds.controller';
import { SpdSccController } from './controller/spd-scc.controller';

import { SpdTechnicalScoringController } from './controller/spd-technical-scoring.controller';
import { SpdBds, SpdScc, SpdTechnicalScoring, Spd } from 'src/entities';
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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Spd,
      SpdBds,
      SpdScc,
      SpdTechnicalScoring,
      SpdPreferenceMargin,
      SpdRequiredDocumentaryEvidence,
      SpdSetting,
    ]),
    DocxModule,
    MinIOModule,
  ],
  providers: [
    SpdService,
    SpdSccService,
    SpdBdsService,
    SpdTechnicalScoringService,
    SpdPreferenceMarginService,
    SpdRequiredDocumentaryEvidenceService,
    SpdSettingService,
  ],
  controllers: [
    SpdController,
    SpdBdsController,
    SpdSccController,
    SpdTechnicalScoringController,
    SpdPreferenceMarginController,
    SpdRequiredDocumentaryEvidencesController,
    SpdSettingsController,
  ],
})
export class SpdModule {}

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
import {
  SpdBdsEntity,
  SpdSccEntity,
  SpdTechnicalScoringEntity,
  SpdEntity,
} from 'src/entities';
import { SpdPrefeenceMarginsController } from './controller/spd-prefeence-margins.controller';
import { SpdRequiredDocumentaryEvidencesController } from './controller/spd-required-documentary-evidences.controller';
import { SpdSettingsController } from './controller/spd-settings.controller';
import { SpdPrefeenceMargins } from 'src/entities/spd-prefeence-margins.entity';
import { SpdRequiredDocumentaryEvidences } from 'src/entities/spd-required-documentary-evidences.entity';
import { SpdSettings } from 'src/entities/spd-settings.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      SpdEntity,
      SpdBdsEntity,
      SpdSccEntity,
      SpdTechnicalScoringEntity,
      SpdPrefeenceMargins,
      SpdRequiredDocumentaryEvidences,
      SpdSettings,
    ]),
  ],
  providers: [
    SpdService,
    SpdSccService,
    SpdBdsService,
    SpdTechnicalScoringService,
    SpdPrefeenceMargins,
    SpdRequiredDocumentaryEvidences,
    SpdSettings,
  ],
  controllers: [
    SpdController,
    SpdBdsController,
    SpdSccController,
    SpdTechnicalScoringController,
    SpdPrefeenceMarginsController,
    SpdRequiredDocumentaryEvidencesController,
    SpdSettingsController,
  ],
})
export class SpdModule {}

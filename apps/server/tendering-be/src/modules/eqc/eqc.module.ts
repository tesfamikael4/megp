import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  EqcDueDiligence,
  EqcPreferenceMargin,
  EqcPreliminaryExamination,
  EqcQualification,
  EqcTechnicalScoring,
} from 'src/entities';
import { EqcDueDiligenceController } from './controller/eqc-due-diligence.controller';
import { EqcPreferenceMarginController } from './controller/eqc-preference-margin.controller';
import { EqcPreliminaryExaminationController } from './controller/eqc-preliminary-examination.controller';
import { EqcQualificationController } from './controller/eqc-qualification.controller';
import { EqcTechnicalScoringController } from './controller/eqc-technical-scoring.controller';
import { EqcPreferenceMarginService } from './service/eqc-preference-margin.service';
import { EqcPreliminaryExaminationService } from './service/eqc-preliminary-examination.service';
import { EqcQualificationService } from './service/eqc-qualification.service';
import { EqcTechnicalScoringService } from './service/eqc-technical-scoring.service';
import { EqcDueDiligenceService } from './service/eqc-due-diligence.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EqcDueDiligence,
      EqcPreferenceMargin,
      EqcPreliminaryExamination,
      EqcQualification,
      EqcTechnicalScoring,
    ]),
  ],
  controllers: [
    EqcDueDiligenceController,
    EqcPreferenceMarginController,
    EqcPreliminaryExaminationController,
    EqcQualificationController,
    EqcTechnicalScoringController,
  ],
  providers: [
    EqcDueDiligenceService,
    EqcPreferenceMarginService,
    EqcPreliminaryExaminationService,
    EqcQualificationService,
    EqcTechnicalScoringService,
  ],
})
export class EqcModule {}

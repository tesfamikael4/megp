import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  EqcDueDiligence,
  EqcPreferenceMargin,
  EqcPreliminaryExamination,
  EqcQualification,
  EqcTechnicalScoring,
} from 'src/entities';
import { EqcDueDiligenceController } from './controller/due-diligence.controller';
import { EqcPreferenceMarginController } from './controller/preference-margin.controller';
import { EqcPreliminaryExaminationController } from './controller/preliminary-examination.controller';
import { EqcQualificationController } from './controller/qualification.controller';
import { EqcTechnicalScoringController } from './controller/technical-scoring.controller';
import { EqcPreferenceMarginService } from './service/preference-margin.service';
import { EqcPreliminaryExaminationService } from './service/preliminary-examination.service';
import { EqcQualificationService } from './service/qualification.service';
import { EqcTechnicalScoringService } from './service/technical-scoring.service';
import { EqcDueDiligenceService } from './service/due-diligence.service';

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

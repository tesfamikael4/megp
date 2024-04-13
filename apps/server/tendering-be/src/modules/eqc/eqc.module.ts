import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  EqcDocumentaryEvidence,
  EqcDueDiligence,
  EqcPreferenceMargin,
  EqcPreliminaryExamination,
  EqcQualification,
  EqcTechnicalScoring,
} from 'src/entities';
import {
  EqcDocumentaryEvidenceService,
  EqcDueDiligenceService,
  EqcPreferenceMarginService,
  EqcPreliminaryExaminationService,
  EqcQualificationService,
  EqcTechnicalScoringService,
} from './service';
import {
  EqcDocumentaryEvidenceController,
  EqcDueDiligenceController,
  EqcPreferenceMarginController,
  EqcPreliminaryExaminationController,
  EqcQualificationController,
  EqcTechnicalScoringController,
} from './controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EqcDocumentaryEvidence,
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
    EqcDocumentaryEvidenceController,
  ],
  providers: [
    EqcDueDiligenceService,
    EqcPreferenceMarginService,
    EqcPreliminaryExaminationService,
    EqcQualificationService,
    EqcTechnicalScoringService,
    EqcDocumentaryEvidenceService,
  ],
})
export class EqcModule {}

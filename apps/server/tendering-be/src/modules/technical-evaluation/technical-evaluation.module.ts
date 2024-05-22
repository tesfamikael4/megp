import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechnicalPreliminaryAssessmentDetail } from 'src/entities';
import { TechnicalPreliminaryAssessmentDetailController } from './controller/technical-preliminary-assessment-detail.controller';
import { TechnicalPreliminaryAssessmentDetailService } from './service/technical-preliminary-assessment-detail.service';
import { BidModule } from '../bid/bid.module';
import { TechnicalPreliminaryAssessmentService } from './service/technical-preliminary-assessment.service';
import { TechnicalPreliminaryAssessment } from 'src/entities/technical-preliminary-assessment.entity';
import { TechnicalPreliminaryAssessmentController } from './controller/technical-preliminary-assessment.controller';
import { TechnicalQualificationAssessmentDetailController } from './controller/technical-qualification-assessment-detail.controller';
import { TechnicalQualificationAssessmentService } from './service/technical-qualification-assessment.service';
import { TechnicalQualificationAssessmentDetailService } from './service/technical-qualification-assessment-detail.service';
import { TechnicalQualificationAssessment } from 'src/entities/technical-qualification-assessments.entity';
import { TechnicalQualificationAssessmentDetail } from 'src/entities/technical-qualification-assessment-detail.entity';
import { TechnicalQualificationAssessmentController } from './controller/technical-qualification-assessments.controller';
import { TechnicalResponsivenessAssessmentDetailController } from './controller/technical-responsiveness-assessment-detail.controller';
import { TechnicalResponsivenessAssessmentController } from './controller/technical-responsiveness-assessments.controller';
import { TechnicalResponsivenessAssessmentDetailService } from './service/technical-responsiveness-assessment-detail.service';
import { TechnicalResponsivenessAssessmentService } from './service/technical-responsiveness-assessment.service';
import { TechnicalResponsivenessAssessment } from 'src/entities/technical-responsiveness-assessments.entity';
import { TechnicalResponsivenessAssessmentDetail } from 'src/entities/technical-responsiveness-assessment-detail.entity';
import { TechnicalScoringAssessment } from 'src/entities/technical-scoring-assessments.entity';
import { TechnicalScoringAssessmentDetail } from 'src/entities/technical-scoring-assessment-detail.entity';
import { TechnicalScoringAssessmentDetailService } from './service/technical-scoring-assessment-detail.service';
import { TechnicalScoringAssessmentService } from './service/technical-scoring-assessment.service';
import { TechnicalScoringAssessmentDetailController } from './controller/technical-scoring-assessment-detail.controller';
import { TechnicalScoringAssessmentController } from './controller/technical-scoring-assessments.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TechnicalPreliminaryAssessment,
      TechnicalPreliminaryAssessmentDetail,
      TechnicalQualificationAssessment,
      TechnicalQualificationAssessmentDetail,
      TechnicalResponsivenessAssessment,
      TechnicalResponsivenessAssessmentDetail,
      TechnicalScoringAssessment,
      TechnicalScoringAssessmentDetail,
    ]),
    BidModule,
  ],
  providers: [
    TechnicalPreliminaryAssessmentDetailService,
    TechnicalPreliminaryAssessmentService,
    TechnicalQualificationAssessmentDetailService,
    TechnicalQualificationAssessmentService,
    TechnicalResponsivenessAssessmentDetailService,
    TechnicalResponsivenessAssessmentService,
    TechnicalScoringAssessmentDetailService,
    TechnicalScoringAssessmentService,
  ],
  controllers: [
    TechnicalPreliminaryAssessmentController,
    TechnicalPreliminaryAssessmentDetailController,
    TechnicalQualificationAssessmentDetailController,
    TechnicalQualificationAssessmentController,
    TechnicalResponsivenessAssessmentDetailController,
    TechnicalResponsivenessAssessmentController,
    TechnicalScoringAssessmentDetailController,
    TechnicalScoringAssessmentController,
  ],
})
export class EvaluationModule {}

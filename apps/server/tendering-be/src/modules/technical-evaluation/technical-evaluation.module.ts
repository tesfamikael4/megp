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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TechnicalPreliminaryAssessment,
      TechnicalPreliminaryAssessmentDetail,
      TechnicalQualificationAssessment,
      TechnicalQualificationAssessmentDetail,
    ]),
    BidModule,
  ],
  providers: [
    TechnicalPreliminaryAssessmentDetailService,
    TechnicalPreliminaryAssessmentService,
    TechnicalQualificationAssessmentDetailService,
    TechnicalQualificationAssessmentService,
  ],
  controllers: [
    TechnicalPreliminaryAssessmentController,
    TechnicalPreliminaryAssessmentDetailController,
    TechnicalQualificationAssessmentDetailController,
    TechnicalQualificationAssessmentController,
  ],
})
export class EvaluationModule {}

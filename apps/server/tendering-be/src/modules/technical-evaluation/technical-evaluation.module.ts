import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechnicalPreliminaryAssessmentDetail } from 'src/entities';
import { TechnicalPreliminaryAssessmentDetailController } from './controller/technical-preliminary-assessment-detail.controller';
import { TechnicalPreliminaryAssessmentDetailService } from './service/technical-preliminary-assessment-detail.service';
import { BidModule } from '../bid/bid.module';
import { TechnicalPreliminaryAssessmentService } from './service/technical-preliminary-assessment.service';
import { TechnicalPreliminaryAssessment } from 'src/entities/technical-preliminary-assessment.entity';
import { TechnicalPreliminaryAssessmentController } from './controller/technical-preliminary-assessment.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TechnicalPreliminaryAssessment,
      TechnicalPreliminaryAssessmentDetail,
    ]),
    BidModule,
  ],
  providers: [
    TechnicalPreliminaryAssessmentDetailService,
    TechnicalPreliminaryAssessmentService,
  ],
  controllers: [
    TechnicalPreliminaryAssessmentController,
    TechnicalPreliminaryAssessmentDetailController,
  ],
})
export class EvaluationModule {}

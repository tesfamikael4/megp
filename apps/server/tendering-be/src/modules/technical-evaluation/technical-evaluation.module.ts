import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechnicalPreliminaryAssessmentDetail } from 'src/entities';
import { TechnicalPreliminaryAssessmentDetailController } from './controller/technical-preliminary-assessment-detail.controller';
import { TechnicalPreliminaryAssessmentDetailService } from './service/technical-preliminary-assessment-detail.service';
import { BidModule } from '../bid/bid.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TechnicalPreliminaryAssessmentDetail]),
    BidModule,
  ],
  providers: [TechnicalPreliminaryAssessmentDetailService],
  controllers: [TechnicalPreliminaryAssessmentDetailController],
})
export class EvaluationModule {}

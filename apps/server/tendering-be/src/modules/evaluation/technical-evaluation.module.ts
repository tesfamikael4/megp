import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechnicalPreliminaryAssessment } from 'src/entities';
import { TechnicalPreliminaryAssessmentController } from './controller/technical-preliminary-assessment.controller';
import { TechnicalPreliminaryAssessmentService } from './service/technical-preliminary-assessment.service';
import { BidModule } from '../bid/bid.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TechnicalPreliminaryAssessment]),
    BidModule,
  ],
  providers: [TechnicalPreliminaryAssessmentService],
  controllers: [TechnicalPreliminaryAssessmentController],
})
export class EvaluationModule { }

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialBidPriceAssessmentController } from './controller/financial-bid-price-assessment.controller';
import { FinancialBidPriceAssessment } from 'src/entities/financial-bid-price-assessment.entity';
import { FinancialBidPriceAssessmentService } from './service/financial-bid-price-assessment.service';

@Module({
  imports: [TypeOrmModule.forFeature([FinancialBidPriceAssessment])],
  providers: [FinancialBidPriceAssessmentService],
  controllers: [FinancialBidPriceAssessmentController],
})
export class FinancialEvaluationModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialBidPriceAssessmentController } from './controller/financial-bid-price-assessment.controller';
import { FinancialBidPriceAssessment } from 'src/entities/financial-bid-price-assessment.entity';
import { FinancialBidPriceAssessmentService } from './service/financial-bid-price-assessment.service';
import { FinancialPriceAnalysis } from 'src/entities/financial-price-analysis.entity';
import { FinancialPriceAnalysisService } from './service/financial-price-analysis.service';
import { FinancialPriceAnalysisController } from './controller/financial-price-analysis.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FinancialBidPriceAssessment,
      FinancialPriceAnalysis,
    ]),
  ],
  providers: [
    FinancialBidPriceAssessmentService,
    FinancialPriceAnalysisService,
  ],
  controllers: [
    FinancialBidPriceAssessmentController,
    FinancialPriceAnalysisController,
  ],
})
export class FinancialEvaluationModule {}

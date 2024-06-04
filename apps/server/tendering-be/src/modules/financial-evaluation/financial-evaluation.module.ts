import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialBidPriceAssessmentController } from './controller/financial-bid-price-assessment.controller';
import { FinancialBidPriceAssessment } from 'src/entities/financial-bid-price-assessment.entity';
import { FinancialBidPriceAssessmentService } from './service/financial-bid-price-assessment.service';
import { FinancialPriceAnalysis } from 'src/entities/financial-price-analysis.entity';
import { FinancialPriceAnalysisService } from './service/financial-price-analysis.service';
import { FinancialPriceAnalysisDetailController } from './controller/financial-price-analysis-detail.controller';
import { FinancialPriceAnalysisDetailService } from './service/financial-price-analysis-detail.service';
import { FinancialPriceAnalysisDetail } from 'src/entities/financial-price-analysis-detail.entity';
import { FinancialPriceAnalysisController } from './controller/financial-price-analysis.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FinancialBidPriceAssessment,
      FinancialPriceAnalysis,
      FinancialPriceAnalysisDetail,
    ]),
  ],
  providers: [
    FinancialBidPriceAssessmentService,
    FinancialPriceAnalysisService,
    FinancialPriceAnalysisDetailService,
  ],
  controllers: [
    FinancialBidPriceAssessmentController,
    FinancialPriceAnalysisController,
    FinancialPriceAnalysisDetailController,
  ],
})
export class FinancialEvaluationModule {}

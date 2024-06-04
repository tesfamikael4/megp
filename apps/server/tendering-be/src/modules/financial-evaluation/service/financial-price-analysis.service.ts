import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { FinancialPriceAnalysis } from 'src/entities/financial-price-analysis.entity';
import { ExtraCrudService } from 'src/shared/service';

import { Repository } from 'typeorm';

@Injectable()
export class FinancialPriceAnalysisService extends ExtraCrudService<FinancialPriceAnalysis> {
  constructor(
    @InjectRepository(FinancialPriceAnalysis)
    private readonly financialPriceAnalysisRepository: Repository<FinancialPriceAnalysis>,

    @Inject(REQUEST)
    private request: Request,
  ) {
    super(financialPriceAnalysisRepository);
  }
}

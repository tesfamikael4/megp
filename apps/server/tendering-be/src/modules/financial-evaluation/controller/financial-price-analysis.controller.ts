import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { FinancialPriceAnalysis } from 'src/entities/financial-price-analysis.entity';
import { FinancialPriceAnalysisService } from '../service/financial-price-analysis.service';

const options: ExtraCrudOptions = {
  entityIdName: 'lotId',
};

@ApiBearerAuth()
@Controller('financial-price-analysis')
@ApiTags('Financial Price Analysis Controller')
export class FinancialPriceAnalysisController extends ExtraCrudController<FinancialPriceAnalysis>(
  options,
) {
  constructor(
    private readonly financialPriceAnalysisService: FinancialPriceAnalysisService,
  ) {
    super(financialPriceAnalysisService);
  }
}

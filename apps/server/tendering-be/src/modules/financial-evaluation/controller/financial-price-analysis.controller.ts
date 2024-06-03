import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { FinancialPriceAnalysis } from 'src/entities/financial-price-analysis.entity';
import { FinancialPriceAnalysisService } from '../service/financial-price-analysis.service';
import { decodeCollectionQuery } from 'src/shared/collection-query';

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

  @Get('bidders-status/:lotId/:itemId')
  async passedBidders(
    @Param('lotId') lotId: string,
    @Param('itemId') itemId: string,
    @Req() req,
    @Query('q') q: string,
  ) {
    const query = decodeCollectionQuery(q);
    return await this.financialPriceAnalysisService.passedBidders(
      lotId,
      itemId,
      query,
      req,
    );
  }
}

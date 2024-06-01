import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { FinancialBidPriceAssessmentService } from '../service/financial-bid-price-assessment.service';
import { FinancialBidPriceAssessment } from 'src/entities/financial-bid-price-assessment.entity';
import { decodeCollectionQuery } from 'src/shared/collection-query';

const options: ExtraCrudOptions = {
  entityIdName: 'lotId',
};

@ApiBearerAuth()
@Controller('financial-bid-price-assessment')
@ApiTags('Financial Bid Price Assessment Controller')
export class FinancialBidPriceAssessmentController extends ExtraCrudController<FinancialBidPriceAssessment>(
  options,
) {
  constructor(
    private readonly financialBidPriceAssessmentService: FinancialBidPriceAssessmentService,
  ) {
    super(financialBidPriceAssessmentService);
  }

  @Get('bidders-status/:lotId')
  async passedBidders(
    @Param('lotId') lotId: string,
    @Req() req,
    @Query('q') q: string,
  ) {
    const query = decodeCollectionQuery(q);
    return await this.financialBidPriceAssessmentService.passedBidders(
      lotId,
      query,
      req,
    );
  }

  @Get('get-items-by-lotId/:lotId')
  async getItemsByLotId(
    @Param('lotId') lotId: string,
    @Req() req,
    @Query('q') q: string,
  ) {
    const query = decodeCollectionQuery(q);
    return await this.financialBidPriceAssessmentService.getItemsByLotId(
      lotId,
      query,
      req,
    );
  }
  @Get('can-assess/:lotId')
  async canAssess(
    @Param('lotId') lotId: string,
    @Req() req,
    @Query('q') q: string,
  ) {
    const query = decodeCollectionQuery(q);
    return await this.financialBidPriceAssessmentService.canAssess(
      lotId,
      query,
      req,
    );
  }
}

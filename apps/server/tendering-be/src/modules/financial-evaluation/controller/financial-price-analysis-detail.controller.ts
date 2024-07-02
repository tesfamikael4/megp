import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { decodeCollectionQuery } from 'src/shared/collection-query';
import { FinancialPriceAnalysisDetail } from 'src/entities/financial-price-analysis-detail.entity';
import { FinancialPriceAnalysisDetailService } from '../service/financial-price-analysis-detail.service';
import {
  CompleteFinancialAnalysisDto,
  submitPriceAnalysisDto,
} from '../dto/financial-assessment.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'financialPriceAnalysisId',
};

@ApiBearerAuth()
@Controller('financial-price-analysis-detail')
@ApiTags('Financial Price Analysis Detail Controller')
export class FinancialPriceAnalysisDetailController extends ExtraCrudController<FinancialPriceAnalysisDetail>(
  options,
) {
  constructor(
    private readonly financialPriceAnalysisDetailService: FinancialPriceAnalysisDetailService,
  ) {
    super(financialPriceAnalysisDetailService);
  }

  @Get('bidders-status/:lotId')
  async passedBidders(
    @Param('lotId') lotId: string,
    @Req() req,
    @Query('q') q: string,
  ) {
    const query = decodeCollectionQuery(q);
    return await this.financialPriceAnalysisDetailService.passedBidders(
      lotId,
      query,
      req,
    );
  }

  @Get('bidder-offered-items/:lotId/:bidderId')
  async bidderOfferedItems(
    @Param('lotId') lotId: string,
    @Param('bidderId') bidderId: string,
    @Req() req,
    @Query('q') q: string,
  ) {
    const query = decodeCollectionQuery(q);
    return await this.financialPriceAnalysisDetailService.getOfferedBidderItems(
      lotId,
      bidderId,
    );
  }

  @ApiBody({})
  @Post('bulk-create')
  async bulkCreate(@Body() items: any, @Req() req?: any): Promise<any> {
    return await this.financialPriceAnalysisDetailService.bulkCreate(
      items,
      req,
    );
  }
  @Put('complete-bidder-evaluation')
  async completeBidderEvaluation(
    @Body() itemData: CompleteFinancialAnalysisDto,
    @Req() req,
  ) {
    return await this.financialPriceAnalysisDetailService.completeBidderEvaluation(
      itemData,
      req,
    );
  }

  @Get('can-complete/:lotId')
  async canComplete(@Param('lotId') lotId: string, @Req() req) {
    return await this.financialPriceAnalysisDetailService.canComplete(
      lotId,
      req,
    );
  }

  @Put('submit')
  async submitChecklist(@Body() itemData: submitPriceAnalysisDto, @Req() req) {
    return await this.financialPriceAnalysisDetailService.submit(itemData, req);
  }
}

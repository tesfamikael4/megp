import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import {
  BidOpeningChecklistAssessmentDetail,
  BidOpeningMinute,
} from 'src/entities';
import { BidOpeningChecklistAssessmentDetailService } from '../service/bid-opening-checklist-assessment-detail.service';
import { BidOpeningMinuteService } from '../service/bid-opening-minute.service';
import { AllowAnonymous } from 'src/shared/authorization';

const options: ExtraCrudOptions = {
  entityIdName: 'tenderId',
};

@Controller('bid-opening-minute')
@ApiTags('Bid opening minute Controller')
export class BidOpeningMinuteController extends ExtraCrudController<BidOpeningMinute>(
  options,
) {
  constructor(
    private readonly bidOpeningMinuteService: BidOpeningMinuteService,
  ) {
    super(bidOpeningMinuteService);
  }

  @Get('bid-opening-minute-report/:lotId')
  async bidOpeningMinuteReport(@Param('lotId') lotId: string) {
    return this.bidOpeningMinuteService.bidOpeningMinuteReport(lotId);
  }
}

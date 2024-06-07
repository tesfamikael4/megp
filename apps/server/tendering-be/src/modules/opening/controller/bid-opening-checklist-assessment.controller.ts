import { Body, Controller, Get, Param, Put, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { BidOpeningChecklistAssessmentDetail as BidOpeningChecklistAssessment } from 'src/entities';
import { BidOpeningChecklistAssessmentDetailService } from '../service/bid-opening-checklist-assessment-detail.service';
import {
  CompleteBidChecklistDto,
  CreateBidOpeningCheckList,
  SubmitChecklistDto,
} from '../dto/bid-opening-checklist.dto';
import { decodeCollectionQuery } from 'src/shared/collection-query';
import { AllowAnonymous } from 'src/shared/authorization';

const options: ExtraCrudOptions = {
  entityIdName: 'lotId',
  createDto: CreateBidOpeningCheckList,
};

@Controller('bid-opening-checklist-assessment')
@ApiTags('Bid opening checklist Assessment Controller')
export class BidOpeningChecklistAssessmentController extends ExtraCrudController<BidOpeningChecklistAssessment>(
  options,
) {
  constructor(
    private readonly bidOpeningChecklistService: BidOpeningChecklistAssessmentDetailService,
  ) {
    super(bidOpeningChecklistService);
  }
}

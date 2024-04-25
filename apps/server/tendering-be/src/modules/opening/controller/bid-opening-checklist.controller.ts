import { Body, Controller, Get, Param, Put, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { BidOpeningChecklist } from 'src/entities';
import { BidOpeningChecklistService } from '../service/bid-opening-checklist.service';
import {
  CreateBidOpeningCheckList,
  SubmitDto,
} from '../dto/bid-opening-checklist.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'lotId',
  createDto: CreateBidOpeningCheckList,
};

@Controller('bid-opening-checklist')
@ApiTags('Bid opening checklist Controller')
export class BidOpeningChecklistController extends ExtraCrudController<BidOpeningChecklist>(
  options,
) {
  constructor(
    private readonly bidOpeningChecklistService: BidOpeningChecklistService,
  ) {
    super(bidOpeningChecklistService);
  }
  @Get('checklist-status/:lotId/:bidderId')
  async checklistStatus(
    @Param('lotId') lotId: string,
    @Param('bidderId') bidderId: string,
    @Req() req,
  ) {
    return await this.bidOpeningChecklistService.checklistStatus(
      lotId,
      bidderId,
      req,
    );
  }

  @Get('opening-status/:lotId')
  async openingStatus(
    @Param('lotId') lotId: string,
    @Req() req,
    @Query('q') q: string,
  ) {
    return await this.bidOpeningChecklistService.openingStatus(lotId, q, req);
  }

  @Put('submit-checklist/:lotId')
  async submitChecklist(@Body() itemData: SubmitDto, @Req() req) {
    return await this.bidOpeningChecklistService.submit(itemData, req);
  }
}

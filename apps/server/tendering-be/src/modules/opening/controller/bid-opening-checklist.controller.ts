import { Controller, Get, Param, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { BidOpeningChecklist } from 'src/entities';
import { BidOpeningChecklistService } from '../service/bid-opening-checklist.service';

const options: ExtraCrudOptions = {
  entityIdName: 'lotId',
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
}

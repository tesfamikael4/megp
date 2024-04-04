import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { BidOpeningChecklist, BidOpeningMinute } from 'src/entities';
import { BidOpeningChecklistService } from '../service/bid-opening-checklist.service';
import { BidOpeningMinuteService } from '../service/bid-opening-minute.service';

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
}

import { Controller } from '@nestjs/common';
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
}

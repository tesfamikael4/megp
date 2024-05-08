import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { BidGuaranteeForfeit } from 'src/entities/bid-guarantee-forfeit.entity';
import { BidGuaranteeForfeitService } from '../service/bid-guarantee-forfeit.service';
import {
  CreateBidGuaranteeForfeitDto,
  UpdateBidGuaranteeForfeitDto,
} from '../dto/bid-guarantee-forfeit.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'guaranteeId',
  createDto: CreateBidGuaranteeForfeitDto,
  updateDto: UpdateBidGuaranteeForfeitDto,
};
@Controller('bid-guarantee-forfeits')
@ApiTags('Bid Guarantee Forfeits')
export class BidGuaranteeForfeitController extends ExtraCrudController<BidGuaranteeForfeit>(
  options,
) {
  constructor(
    private readonly bidGuaranteeorfeitService: BidGuaranteeForfeitService,
  ) {
    super(bidGuaranteeorfeitService);
  }
}

import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import {
  CreateBidGuaranteeCancellationDto,
  UpdateBidGuaranteeCancellationDto,
} from '../dto/bid-guarantee-cancellation.dto';
import { BidGuaranteeCancellationService } from '../service/bid-guarantee-cancellation.service';
import { BidGuaranteeCancellation } from 'src/entities/bid-guarantee-cancellation.entity';

const options: ExtraCrudOptions = {
  entityIdName: 'guaranteeId',
  createDto: CreateBidGuaranteeCancellationDto,
  updateDto: UpdateBidGuaranteeCancellationDto,
};
@Controller('bid-guarantee-cancellations')
@ApiTags('Bid Guarantee Cancellations')
export class BidGuaranteeCancellationController extends ExtraCrudController<BidGuaranteeCancellation>(
  options,
) {
  constructor(
    private readonly bidGuaranteeCancellationService: BidGuaranteeCancellationService,
  ) {
    super(bidGuaranteeCancellationService);
  }
}

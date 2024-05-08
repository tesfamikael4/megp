import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { BidGuaranteeRelease } from 'src/entities/bid-guarantee-release.entity';
import {
  CreateBidGuaranteeReleaseDto,
  UpdateBidGuaranteeReleaseDto,
} from '../dto/bid-guarantee-release.dto';
import { BidGuaranteeReleaseService } from '../service/bid-guarantee-release.service';

const options: ExtraCrudOptions = {
  entityIdName: 'guaranteeId',
  createDto: CreateBidGuaranteeReleaseDto,
  updateDto: UpdateBidGuaranteeReleaseDto,
};
@Controller('bid-guarantee-releases')
@ApiTags('Bid Guarantee Releases')
export class BidGuaranteeReleaseController extends ExtraCrudController<BidGuaranteeRelease>(
  options,
) {
  constructor(
    private readonly bidGuaranteeReleaseService: BidGuaranteeReleaseService,
  ) {
    super(bidGuaranteeReleaseService);
  }
}

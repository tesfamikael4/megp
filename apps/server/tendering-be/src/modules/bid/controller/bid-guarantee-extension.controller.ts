import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { BidGuaranteeExtension } from 'src/entities/bid-guarantee-extension.entity';
import {
  CreateBidGuaranteeExtensionDto,
  UpdateBidGuaranteeExtensionDto,
} from '../dto/bid-guarantee-extension.dto';
import { BidGuaranteeExtensionService } from '../service/bid-guarantee-extension.service';
const options: ExtraCrudOptions = {
  entityIdName: 'guaranteeId',
  createDto: CreateBidGuaranteeExtensionDto,
  updateDto: UpdateBidGuaranteeExtensionDto,
};
@Controller('bid-guarantee-extensions')
@ApiTags('Bid Guarantee Extensions')
export class BidGuaranteeExtensionController extends ExtraCrudController<BidGuaranteeExtension>(
  options,
) {
  constructor(
    private readonly bidGuaranteeExtensionService: BidGuaranteeExtensionService,
  ) {
    super(bidGuaranteeExtensionService);
  }
}

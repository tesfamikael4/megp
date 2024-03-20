import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BidResponse } from 'src/entities/bid-response.entity';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { BidResponseService } from '../service/bid-response.service';
import { ExtraCrudController } from 'src/shared/controller';
import { CreateBidResponseDto } from '../dto/bid-response.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'tenderId',
  createDto: CreateBidResponseDto,
};

@ApiBearerAuth()
@Controller('bid-responses')
@ApiTags('Bid Response Controller')
export class BidResponseController extends ExtraCrudController<BidResponse>(
  options,
) {
  constructor(private readonly bidSecurityService: BidResponseService) {
    super(bidSecurityService);
  }
}

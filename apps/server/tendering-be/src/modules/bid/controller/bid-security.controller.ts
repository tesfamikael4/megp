import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BidSecurity } from 'src/entities';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { BidSecurityService } from '../service/bid-security.service';
import { ExtraCrudController } from 'src/shared/controller';
import { CreateBidSecurityDto, UpdateBidSecurityDto } from '../dto';

const options: ExtraCrudOptions = {
  entityIdName: 'lotId',
  createDto: CreateBidSecurityDto,
  updateDto: UpdateBidSecurityDto,
};

@ApiBearerAuth()
@Controller('bid-securities')
@ApiTags('Bid Security Controller')
export class BidSecurityController extends ExtraCrudController<BidSecurity>(
  options,
) {
  constructor(private readonly bidSecurityService: BidSecurityService) {
    super(bidSecurityService);
  }
}

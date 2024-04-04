import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { BidSecurity } from 'src/entities';
import { BidSecurityService } from '../service/bid-security.service';

const options: ExtraCrudOptions = {
  entityIdName: 'tenderId',
};

@Controller('bid-security')
@ApiTags('Bid security Controller')
export class BidSecurityController extends ExtraCrudController<BidSecurity>(
  options,
) {
  constructor(private readonly bidSecurityService: BidSecurityService) {
    super(bidSecurityService);
  }
}

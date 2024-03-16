import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BdsBidSecurity } from 'src/entities';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { BdsBidSecurityService } from '../service/bid-security.service';
import { ExtraCrudController } from 'src/shared/controller';
import {
  CreateBidSecurityDto,
  UpdateBidSecurityDto,
} from '../dto/bid-security.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'lotId',
  createDto: CreateBidSecurityDto,
  updateDto: UpdateBidSecurityDto,
};

@ApiBearerAuth()
@Controller('bds-bid-securities')
@ApiTags('Bds Bid Security Controller')
export class BdsBidSecurityController extends ExtraCrudController<BdsBidSecurity>(
  options,
) {
  constructor(private readonly bidSecurityService: BdsBidSecurityService) {
    super(bidSecurityService);
  }
}

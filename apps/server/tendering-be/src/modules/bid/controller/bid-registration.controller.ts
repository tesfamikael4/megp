import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BidRegistration } from 'src/entities/bid-registration.entity';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { BidRegistrationService } from '../service/bid-registration.service';
import { ExtraCrudController } from 'src/shared/controller';
import { CreateBidRegistrationDto } from '../dto/bid-registration.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'tenderId',
  createDto: CreateBidRegistrationDto,
};

@ApiBearerAuth()
@Controller('bid-registrations')
@ApiTags('Bid Registration Controller')
export class BidRegistrationController extends ExtraCrudController<BidRegistration>(
  options,
) {
  constructor(private readonly bidSecurityService: BidRegistrationService) {
    super(bidSecurityService);
  }
}

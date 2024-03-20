import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BidRegistration } from 'src/entities/bid-registration.entity';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { BidRegistrationService } from '../service/bid-registration.service';
import { ExtraCrudController } from 'src/shared/controller';
import { CreateBidRegistrationDto } from '../dto/bid-registration.dto';
import { decodeCollectionQuery } from 'src/shared/collection-query';

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

  @Get('my-registered-bids')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  async getMyRegisteredBids(@Query('q') q: string, @Req() req?: any) {
    const query = decodeCollectionQuery(q);
    return this.bidSecurityService.getMyRegisteredBids(query, req);
  }
}

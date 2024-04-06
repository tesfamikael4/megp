import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BidRegistration } from 'src/entities/bid-registration.entity';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { BidRegistrationService } from '../service/bid-registration.service';
import { ExtraCrudController } from 'src/shared/controller';
import {
  CreateBidRegistrationDto,
  CreateBidRegistrationStatusDto,
} from '../dto/bid-registration.dto';
import { decodeCollectionQuery } from 'src/shared/collection-query';
import { JwtGuard } from 'src/shared/authorization';
import { VendorGuard } from 'src/shared/authorization/guards/vendor.guard';

const options: ExtraCrudOptions = {
  entityIdName: 'tenderId',
  createDto: CreateBidRegistrationDto,
};

@ApiBearerAuth()
@Controller('bid-registrations')
@ApiTags('Bid Registration Controller')
@UseGuards(JwtGuard, VendorGuard())
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
    return await this.bidSecurityService.getMyRegisteredBids(query, req);
  }

  @Post('submit')
  async submitLot(
    @Body() itemData: CreateBidRegistrationStatusDto,
    @Req() req?: any,
  ) {
    return await this.bidSecurityService.submitLot(itemData, req);
  }

  @Get('all-bidders/:tenderId')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  async getAllBiddersByTenderId(
    @Param('tenderId') tenderId: string,
    @Query('q') q: string,
  ) {
    const query = decodeCollectionQuery(q);
    return await this.bidSecurityService.getAllBiddersByTenderId(
      tenderId,
      query,
    );
  }

  @Get('submitted-bidders/:lotId')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  async getSubmittedBiddersByLotId(
    @Param('lotId') lotId: string,
    @Query('q') q: string,
  ) {
    const query = decodeCollectionQuery(q);
    return await this.bidSecurityService.getSubmittedBiddersByLotId(
      lotId,
      query,
    );
  }
}

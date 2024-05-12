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
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
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
  constructor(private readonly bidRegistrationService: BidRegistrationService) {
    super(bidRegistrationService);
  }

  @Post()
  async create(@Body() itemData: CreateBidRegistrationDto, @Req() req?: any) {
    return await this.bidRegistrationService.create(itemData, req);
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
    return await this.bidRegistrationService.getMyRegisteredBids(query, req);
  }

  @Get('registered-bid/:tenderId')
  async getRegisteredBidByTenderId(
    @Param('tenderId') tenderId: string,
    @Req() req?: any,
  ) {
    return await this.bidRegistrationService.getRegisteredBidByTenderId(
      tenderId,
      req,
    );
  }

  @Post('submit')
  async submitLot(
    @Body() itemData: CreateBidRegistrationStatusDto,
    @Req() req?: any,
  ) {
    return await this.bidRegistrationService.submitLot(itemData, req);
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
    return await this.bidRegistrationService.getAllBiddersByTenderId(
      tenderId,
      query,
    );
  }

  @Get('submitted-bidders-by-tender-id/:tenderId')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  async getSubmittedBiddersByTenderId(
    @Param('tenderId') tenderId: string,
    @Query('q') q: string,
  ) {
    const query = decodeCollectionQuery(q);
    return await this.bidRegistrationService.getSubmittedBiddersByTenderId(
      tenderId,
      query,
    );
  }

  @Get('submitted-bidders-by-lot-id/:lotId')
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
    return await this.bidRegistrationService.getSubmittedBiddersByLotId(
      lotId,
      query,
    );
  }
}

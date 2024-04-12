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
import { JwtGuard } from 'src/shared/authorization';
import { VendorGuard } from 'src/shared/authorization/guards/vendor.guard';
import { BidResponseItemService } from '../service/bid-response-item.service';
import {
  CreateBidResponseItemDto,
  GetBidResponseItemDto,
} from '../dto/bid-response.dto';
import { decodeCollectionQuery } from 'src/shared/collection-query';

@ApiBearerAuth()
@Controller('bid-item-responses')
@ApiTags('Bid item Response Controller')
@UseGuards(JwtGuard, VendorGuard())
export class BidResponseItemController {
  constructor(private readonly bidSecurityService: BidResponseItemService) {}

  @Post('technical-response')
  async createBidResponseItemTechnicalResponse(
    @Body() payload: CreateBidResponseItemDto,
    @Req() req?: any,
  ) {
    return await this.bidSecurityService.createBidResponseItemTechnicalResponse(
      payload,
      req,
    );
  }

  @Post('financial-response')
  async createBidResponseItemFinancialResponse(
    @Body() payload: CreateBidResponseItemDto,
    @Req() req?: any,
  ) {
    return await this.bidSecurityService.createBidResponseItemFinancialResponse(
      payload,
      req,
    );
  }

  @Post('get-item-response-sor')
  async getBidResponseItemSorByKey(
    @Body() payload: GetBidResponseItemDto,
    @Req() req?: any,
  ) {
    return await this.bidSecurityService.getBidResponseItemSorByKey(
      payload,
      req,
    );
  }

  @Post('get-item-response-by-key')
  async getBidResponseItemByKey(
    @Body() payload: GetBidResponseItemDto,
    @Req() req?: any,
  ) {
    return await this.bidSecurityService.getBidResponseItemByKey(payload, req);
  }

  @Get('items/:lotId')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  async getItems(
    @Param('lotId') lotId: string,
    @Query('q') q: string,
    @Req() req?: any,
  ) {
    const query = decodeCollectionQuery(q);

    return this.bidSecurityService.getFinancialItems(
      lotId,
      'P@ssw0rd',
      query,
      req,
    );
  }
}

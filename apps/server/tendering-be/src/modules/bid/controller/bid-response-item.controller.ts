import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/shared/authorization';
import { VendorGuard } from 'src/shared/authorization/guards/vendor.guard';
import { BidResponseItemService } from '../service/bid-response-item.service';
import {
  CreateBidResponseItemDto,
  GetBidResponseItemDto,
} from '../dto/bid-response.dto';

@ApiBearerAuth()
@Controller('bid-item-responses')
@ApiTags('Bid item Response Controller')
@UseGuards(JwtGuard, VendorGuard())
export class BidResponseItemController {
  constructor(private readonly bidSecurityService: BidResponseItemService) {}

  @Post('create-bid-response-item')
  async createBidResponseItem(
    @Body() payload: CreateBidResponseItemDto,
    @Req() req?: any,
  ) {
    return await this.bidSecurityService.createBidResponseItem(payload, req);
  }

  @Post('get-bid-response-item-sor')
  async getBidResponseItemSorByKey(
    @Body() payload: GetBidResponseItemDto,
    @Req() req?: any,
  ) {
    return await this.bidSecurityService.getBidResponseItemSorByKey(
      payload,
      req,
    );
  }
}

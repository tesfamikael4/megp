import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/shared/authorization';
import { VendorGuard } from 'src/shared/authorization/guards/vendor.guard';
import { BidResponseItemService } from '../service/bid-response-item.service';
import {
  BidResponseItemDto,
  CreateBidResponseItemDto,
  GetBidResponseItemDto,
} from '../dto/bid-response.dto';

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

  @Post('financial-response-items')
  async getFinancialItems(
    @Body() payload: BidResponseItemDto,
    @Req() req?: any,
  ) {
    return this.bidSecurityService.getFinancialItems(payload, req);
  }

  @Post('technical-response-items')
  async getTechnicalItems(
    @Body() payload: BidResponseItemDto,
    @Req() req?: any,
  ) {
    return this.bidSecurityService.getTechnicalItems(payload, req);
  }
}

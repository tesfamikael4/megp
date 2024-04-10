import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/shared/authorization';
import { VendorGuard } from 'src/shared/authorization/guards/vendor.guard';
import { BidResponseTenderService } from '../service/bid-response-tender.service';
import {
  CreateBidResponseTenderDto,
  GetBidResponseTenderDto,
} from '../dto/bid-response.dto';

@ApiBearerAuth()
@Controller('bid-tender-responses')
@ApiTags('Bid tender Response Controller')
@UseGuards(JwtGuard, VendorGuard())
export class BidResponseTenderController {
  constructor(private readonly bidSecurityService: BidResponseTenderService) {}

  @Post('create-bid-response-tender')
  async createBidResponseTender(
    @Body() payload: CreateBidResponseTenderDto,
    @Req() req?: any,
  ) {
    return await this.bidSecurityService.createBidResponseTender(payload, req);
  }

  @Post('get-bid-response-tender')
  async getBidResponseTenderByKey(
    @Body() payload: GetBidResponseTenderDto,
    @Req() req?: any,
  ) {
    return await this.bidSecurityService.getBidResponseTenderByKey(
      payload,
      req,
    );
  }
}

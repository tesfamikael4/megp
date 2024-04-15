import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AllowAnonymous, JwtGuard } from 'src/shared/authorization';
import { VendorGuard } from 'src/shared/authorization/guards/vendor.guard';
import { BidResponseOpeningService } from '../service/bid-response-opening.service';
import { OpenBidResponseDto } from '../dto/bid-response.dto';

@ApiBearerAuth()
@Controller('bid-response-openings')
@ApiTags('Bid Response Openings Controller')
// @UseGuards(JwtGuard, VendorGuard())
export class BidResponseOpeningController {
  constructor(private readonly bidSecurityService: BidResponseOpeningService) {}

  @Post('open-bid-response')
  @AllowAnonymous()
  async openBidResponse(@Body() payload: OpenBidResponseDto) {
    return await this.bidSecurityService.openBidResponse(payload);
  }
}

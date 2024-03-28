import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BidResponse } from 'src/entities/bid-response.entity';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { BidResponseService } from '../service/bid-response.service';
import { ExtraCrudController } from 'src/shared/controller';
import {
  CheckPasswordDto,
  CreateBidResponseDto,
  CreateBidResponseTenderDto,
  GetBidResponseDto,
  GetBidResponseTenderDto,
} from '../dto/bid-response.dto';
import { JwtGuard } from 'src/shared/authorization';
import { VendorGuard } from 'src/shared/authorization/guards/vendor.guard';

const options: ExtraCrudOptions = {
  entityIdName: 'tenderId',
  createDto: CreateBidResponseDto,
};

@ApiBearerAuth()
@Controller('bid-responses')
@ApiTags('Bid Response Controller')
@UseGuards(JwtGuard, VendorGuard())
export class BidResponseController extends ExtraCrudController<BidResponse>(
  options,
) {
  constructor(private readonly bidSecurityService: BidResponseService) {
    super(bidSecurityService);
  }

  @Post('create-bid-response-tender')
  async createBidResponseTender(
    @Body() payload: CreateBidResponseTenderDto,
    @Req() req?: any,
  ) {
    return await this.bidSecurityService.createBidResponseTender(payload, req);
  }

  @Post('check-password')
  async checkPassword(@Body() payload: CheckPasswordDto, @Req() req?: any) {
    return await this.bidSecurityService.checkPassword(payload, req);
  }

  @Post('get-bid-response')
  async getBidResponseByKey(
    @Body() payload: GetBidResponseDto,
    @Req() req?: any,
  ) {
    return await this.bidSecurityService.getBidResponseByKey(payload, req);
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

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
import { BidResponseLot } from 'src/entities/bid-response-lot.entity';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { BidResponseService } from '../service/bid-response.service';
import { ExtraCrudController } from 'src/shared/controller';
import {
  CheckPasswordDto,
  CreateBidResponseDto,
  CreateBidResponseItemDto,
  CreateBidResponseTenderDto,
  GetBidResponseDto,
  GetBidResponseItemDto,
  GetBidResponseTenderDto,
} from '../dto/bid-response.dto';
import { JwtGuard } from 'src/shared/authorization';
import { VendorGuard } from 'src/shared/authorization/guards/vendor.guard';
import { decodeCollectionQuery } from 'src/shared/collection-query';

const options: ExtraCrudOptions = {
  entityIdName: 'tenderId',
  createDto: CreateBidResponseDto,
};

@ApiBearerAuth()
@Controller('bid-responses')
@ApiTags('Bid Response Controller')
@UseGuards(JwtGuard, VendorGuard())
export class BidResponseController extends ExtraCrudController<BidResponseLot>(
  options,
) {
  constructor(private readonly bidSecurityService: BidResponseService) {
    super(bidSecurityService);
  }

  @Get('item-response/:lotId')
  async getItems(@Param('lotId') lotId: string, @Req() req?: any) {
    return this.bidSecurityService.getItems(lotId, req);
  }

  @Post('create-bid-response-tender')
  async createBidResponseTender(
    @Body() payload: CreateBidResponseTenderDto,
    @Req() req?: any,
  ) {
    return await this.bidSecurityService.createBidResponseTender(payload, req);
  }

  @Post('create-bid-response-item')
  async createBidResponseItem(
    @Body() payload: CreateBidResponseItemDto,
    @Req() req?: any,
  ) {
    return await this.bidSecurityService.createBidResponseItem(payload, req);
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

  @Post('get-bid-response-item')
  async getBidResponseItemByKey(
    @Body() payload: GetBidResponseItemDto,
    @Req() req?: any,
  ) {
    return await this.bidSecurityService.getBidResponseItemByKey(payload, req);
  }
}

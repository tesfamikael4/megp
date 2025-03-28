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
import { BidResponseLotService } from '../service/bid-response-lot.service';
import {
  CheckPasswordDto,
  CreateBidResponseDto,
  GenerateBidDeclarationDto,
  GetBidResponseDto,
} from '../dto/bid-response.dto';
import { JwtGuard } from 'src/shared/authorization';
import { VendorGuard } from 'src/shared/authorization/guards/vendor.guard';
import { decodeCollectionQuery } from 'src/shared/collection-query';

@ApiBearerAuth()
@Controller('bid-responses')
@ApiTags('Bid Response Controller')
@UseGuards(JwtGuard, VendorGuard())
export class BidResponseLotController {
  constructor(private readonly bidSecurityService: BidResponseLotService) {}

  @Post()
  async create(@Body() itemData: CreateBidResponseDto, @Req() req?: any) {
    return this.bidSecurityService.create(itemData, req);
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

    return this.bidSecurityService.getItems(lotId, query, req);
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

  @Post('generate-bid-declaration')
  async generateBidDeclaration(
    @Body() payload: GenerateBidDeclarationDto,
    @Req() req?: any,
  ) {
    return await this.bidSecurityService.generateBidDeclaration(payload, req);
  }
}

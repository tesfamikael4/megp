import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/shared/authorization';
import { VendorGuard } from 'src/shared/authorization/guards/vendor.guard';
import { BidResponseDocumentService } from '../service/bid-response-document.service';
import {
  GetBidResponseTenderDto,
  UploadBidResponseDocumentDto,
} from '../dto/bid-response.dto';

@ApiBearerAuth()
@Controller('bid-document-responses')
@ApiTags('Bid document Response Controller')
@UseGuards(JwtGuard, VendorGuard())
export class BidResponseDocumentController {
  constructor(
    private readonly bidSecurityService: BidResponseDocumentService,
  ) {}

  @Post('upload-bid-response-document')
  async uploadBidResponseDocument(
    @Body() payload: UploadBidResponseDocumentDto,
    @Req() req?: any,
  ) {
    return await this.bidSecurityService.uploadBidResponseDocument(
      payload,
      req,
    );
  }

  @Post('get-bid-response-document')
  async getBidResponseDocumentByKey(
    @Body() payload: GetBidResponseTenderDto,
    @Req() req?: any,
  ) {
    return await this.bidSecurityService.getBidResponseDocumentByKey(
      payload,
      req,
    );
  }
}

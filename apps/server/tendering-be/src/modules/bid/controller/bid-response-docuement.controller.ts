import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/shared/authorization';
import { VendorGuard } from 'src/shared/authorization/guards/vendor.guard';
import { BidResponseDocumentService } from '../service/bid-response-document.service';
import {
  BidResponseDocumentDto,
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

  @Post('upload-response')
  async uploadBidResponseDocument(
    @Body() payload: UploadBidResponseDocumentDto,
    @Req() req?: any,
  ) {
    return await this.bidSecurityService.uploadBidResponseDocument(
      payload,
      req,
    );
  }

  @Post('get-responses/:lotId')
  async getBidResponse(@Param('lotId') lotId: string, @Req() req?: any) {
    return await this.bidSecurityService.getBidResponse(lotId, req);
  }

  @Post('download-response-pdf')
  async getBidResponseDocumentPdf(
    @Body() payload: BidResponseDocumentDto,
    @Req() req?: any,
  ) {
    return await this.bidSecurityService.getBidResponseDocumentPdf(
      payload,
      req,
    );
  }

  @Post('download-response-docx')
  async getBidResponseDocumentDocx(
    @Body() payload: BidResponseDocumentDto,
    @Req() req?: any,
  ) {
    return await this.bidSecurityService.getBidResponseDocumentDocx(
      payload,
      req,
    );
  }
}

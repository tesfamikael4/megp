import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/shared/authorization';
import { VendorGuard } from 'src/shared/authorization/guards/vendor.guard';
import { BidResponseDocumentaryEvidenceService } from '../service/bid-response-documentary-evidence.service';
import {
  BidResponseDocumentaryEvidenceDto,
  GetPresignedBidResponseDocumentaryEvidenceDto,
  UploadBidResponseDocumentaryEvidenceDto,
} from '../dto/bid-response.dto';

@ApiBearerAuth()
@Controller('bid-documentary-evidence-responses')
@ApiTags('Bid documentary evidence Response Controller')
@UseGuards(JwtGuard, VendorGuard())
export class BidResponseDocumentaryEvidenceController {
  constructor(
    private readonly bidSecurityService: BidResponseDocumentaryEvidenceService,
  ) {}

  @Post('upload-response')
  async uploadBidResponseDocumentaryEvidence(
    @Body() payload: UploadBidResponseDocumentaryEvidenceDto,
    @Req() req?: any,
  ) {
    return await this.bidSecurityService.uploadBidResponseDocumentaryEvidence(
      payload,
      req,
    );
  }

  @Post('download-response')
  async getBidResponseDocumentaryEvidence(
    @Body() payload: BidResponseDocumentaryEvidenceDto,
    @Req() req?: any,
  ) {
    return await this.bidSecurityService.getBidResponseDocumentaryEvidence(
      payload,
      req,
    );
  }

  @Post('download-response-by-id')
  async getBidResponseDocumentaryEvidenceById(
    @Body() payload: GetPresignedBidResponseDocumentaryEvidenceDto,
  ) {
    return await this.bidSecurityService.getBidResponseDocumentaryEvidenceById(
      payload,
    );
  }
}

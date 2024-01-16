import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { QrCodeService } from './qr-generator.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('qr-code')
@ApiTags('qr-code')
export class QrCodeController {
  constructor(private readonly qrCodeService: QrCodeService) {}

  @Post()
  async generateQrCode(@Body() data: any) {
    return await this.qrCodeService.generateQrCode(data);
  }
}

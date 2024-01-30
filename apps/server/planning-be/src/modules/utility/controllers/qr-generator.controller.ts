import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { QrCodeService } from '../services/qr-generator.service';

@Controller('qr-code')
@ApiTags('qr-code')
export class QrCodeController {
  constructor(private readonly qrCodeService: QrCodeService) {}

  @Post()
  async generateQrCode(@Body() data: any) {
    return await this.qrCodeService.generateQrCode(data);
  }
}

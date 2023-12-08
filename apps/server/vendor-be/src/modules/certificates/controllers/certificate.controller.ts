import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';

import { Readable } from 'stream';
import { CertificateService } from '../services/certificate.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiBearerAuth()
@Controller('certificates')
@ApiTags('certificates generator')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) { }
  @Get('generate-certeficate')
  async generateCertificate(
    @Res() res: Response,
    @Query('vendorId') vendorId: string,
  ): Promise<void> {
    try {
      //  const certificateData = { userName };
      const pdfStream: Readable = await this.certificateService.generateCertificate(vendorId);
      // Set up the response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${vendorId}_certificate.pdf`);
      // Pipe the PDF stream to the response
      pdfStream.pipe(res);
    } catch (err) {
      console.error('Error:', err);
      res.status(500).send('Internal Server Error');
    }
  }
}
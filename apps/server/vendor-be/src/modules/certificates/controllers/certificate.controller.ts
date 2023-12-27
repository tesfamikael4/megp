import { Controller, Get, Param, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { Readable } from 'stream';
import { CertificateService } from '../services/certificate.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtGuard } from 'src/shared/authorization';
import { FileService } from 'src/modules/vendor-registration/services/file.service';
@ApiBearerAuth()
@Controller('certificates')
@ApiTags('certificates generator')
export class CertificateController {
  constructor(
    private readonly certificateService: CertificateService,
    private readonly fileService: FileService,
  ) { }
  @UseGuards(JwtGuard)
  @Get('generate-certeficate/:vendorId/:instanceId')
  async generateCertificate(
    @Param('vendorId') vendorId: string,
    @Param('instanceId') instanceId: string,
    @Res() res: Response,
    @CurrentUser() user: any,
  ): Promise<void> {
    try {
      console.log('user info', user);
      const pdfStream: Readable =
        await this.certificateService.generateCertificate(
          vendorId,
          instanceId,
          user,
        );
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${vendorId}_certificate.pdf`,
      );
      pdfStream.pipe(res);

    } catch (err) {
      console.error('Error:', err);
      res.status(500).send('Internal Server Error');
    }
  }
  @Get('get-certificate/:vendorId/:fileId')
  async getCertificate(
    @Param('fileId') fileId: string,
    @Param('vendorId') vendorId: string,
    @CurrentUser() userInfo: any,
    @Res() resp: Response
  ) {
    console.log('fileId', userInfo);
    return await this.fileService.getCertificate(fileId, vendorId, resp);
  }
}

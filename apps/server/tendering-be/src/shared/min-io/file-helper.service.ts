import { Injectable } from '@nestjs/common';
import { MinIOService } from 'src/shared/min-io/min-io.service';
import * as libre from 'libreoffice-convert';
import { promisify } from 'util';
import { BucketNameEnum } from './bucket-name.enum';

@Injectable()
export class FileHelperService {
  constructor(private readonly minIOService: MinIOService) {}

  async convertAndUpload(file: Express.Multer.File) {
    try {
      const libreConverterAsync = promisify(libre.convert);

      const pdfBuffer = await libreConverterAsync(
        file.buffer,
        '.pdf',
        undefined,
      );

      const fileType = file.originalname.split('.');

      const fileName = fileType[0] + '.pdf';

      const fileInfo = await this.minIOService.uploadBuffer(
        pdfBuffer,
        fileName,
        'application/pdf',
        BucketNameEnum.SPD_TEMPLATE,
      );

      // return { fileInfo, buffer };
      return fileInfo;
    } catch (error) {
      throw error;
    }
  }
}

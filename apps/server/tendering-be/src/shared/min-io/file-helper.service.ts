import { Injectable } from '@nestjs/common';
import { MinIOService } from 'src/shared/min-io/min-io.service';
import * as fs from 'fs';
import { PDFEngine } from 'chromiumly';

@Injectable()
export class FileHelperService {
  constructor(private readonly minIOService: MinIOService) {}

  async convertAndUpload(file: Express.Multer.File, bucketName: string) {
    try {
      const outputPath = 'temp.pdf';

      await fs.writeFileSync(outputPath, '');

      const buffer = await PDFEngine.convert({
        files: [file.buffer, outputPath],
      });

      await fs.unlinkSync(outputPath);

      const fileType = file.originalname.split('.');

      const fileName = fileType[0] + '.pdf';

      const fileInfo = await this.minIOService.uploadBuffer(
        buffer,
        fileName,
        'application/pdf',
        bucketName,
      );

      // return { fileInfo, buffer };
      return fileInfo;
    } catch (error) {
      throw error;
    }
  }
}

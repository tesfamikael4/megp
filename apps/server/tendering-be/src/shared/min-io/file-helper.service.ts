import { Injectable } from '@nestjs/common';
import { PDFEngine } from 'chromiumly';
import { unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';
import { MinIOService } from 'src/shared/min-io/min-io.service';

@Injectable()
export class FileHelperService {
  constructor(private readonly minIOService: MinIOService) {}

  async convertAndUpload(file: Express.Multer.File) {
    try {
      let outputPath = join(process.cwd(), 'src', 'temp.pdf');

      if (process.env.NODE_ENV === 'production') {
        outputPath = join(
          process.cwd(),
          'apps',
          'server',
          'tendering-be',
          'dist',
          'temp.pdf',
        );
      }

      await writeFileSync(outputPath, '');

      const buffer = await PDFEngine.convert({
        files: [file.buffer, outputPath],
      });

      await unlinkSync(outputPath);

      const fileType = file.originalname.split('.');

      const fileName = fileType[0] + '.pdf';

      const fileInfo = await this.minIOService.uploadBuffer(
        buffer,
        fileName,
        'application/pdf',
      );

      // return { fileInfo, buffer };
      return fileInfo;
    } catch (error) {
      throw error;
    }
  }
}

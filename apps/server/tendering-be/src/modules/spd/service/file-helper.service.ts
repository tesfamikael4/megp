import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PDFEngine } from 'chromiumly';
import { unlink, writeFile } from 'fs';
import { join } from 'path';
import { MinIOService } from 'src/shared/min-io/min-io.service';

@Injectable()
export class FileHelperService {
  constructor(private readonly minIOService: MinIOService) {}

  async convertAndUpload(file: Express.Multer.File) {
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

    await writeFile(outputPath, '', (err) => {
      if (err)
        throw new HttpException(
          `Could not create temporary pdf file: ${outputPath}: ${err}`,
          HttpStatus.EXPECTATION_FAILED,
        );
    });

    const buffer = await PDFEngine.convert({
      files: [file.buffer, outputPath],
    });

    unlink(outputPath, (err) => {
      if (err)
        throw new HttpException(
          'Could not delete temporary pdf file',
          HttpStatus.EXPECTATION_FAILED,
        );
    });

    const fileType = file.originalname.split('.');

    const fileName = fileType[0] + '.pdf';

    const fileInfo = await this.minIOService.uploadBuffer(
      buffer,
      fileName,
      'application/pdf',
    );

    // return { fileInfo, buffer };
    return fileInfo;
  }
}

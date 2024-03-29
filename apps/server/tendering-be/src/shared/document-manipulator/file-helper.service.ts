import { Injectable } from '@nestjs/common';
import { MinIOService } from 'src/shared/min-io/min-io.service';
import { DocumentManipulatorService } from './document-manipulator.service';

@Injectable()
export class FileHelperService {
  constructor(
    private readonly minIOService: MinIOService,
    private readonly documentManipulatorService: DocumentManipulatorService,
  ) {}

  async convertAndUpload(file: Express.Multer.File, bucketName: string) {
    try {
      const buffer = await this.documentManipulatorService.convertDocxToPdf(
        file.buffer,
      );

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

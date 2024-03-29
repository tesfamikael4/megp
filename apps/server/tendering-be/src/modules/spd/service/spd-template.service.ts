import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { DocxService } from 'src/shared/docx/docx.service';
import { MinIOService, BucketNameEnum } from 'src/shared/min-io';
import { SpdTemplate } from 'src/entities/spd-template.entity';
import { DocumentManipulatorService } from 'src/shared/document-manipulator/document-manipulator.service';
import { join } from 'path';
import * as fs from 'fs';
import { FileHelperService } from 'src/shared/document-manipulator/file-helper.service';

@Injectable()
export class SpdTemplateService extends ExtraCrudService<SpdTemplate> {
  constructor(
    @InjectRepository(SpdTemplate)
    private readonly spdTemplateRepository: Repository<SpdTemplate>,
    private readonly docxService: DocxService,
    private readonly minIOService: MinIOService,
    private readonly fileHelperService: FileHelperService,
    private readonly documentManipulatorService: DocumentManipulatorService,
  ) {
    super(spdTemplateRepository);
  }

  async uploadSPDDocument(
    spdId: string,
    type: string,
    file: Express.Multer.File,
  ) {
    try {
      const result = await this.docxService.validateDocument(file.buffer, [
        'public_body',
      ]);

      if (result.length != 0) {
        throw new BadRequestException(result);
      }

      const documentDocx = await this.minIOService.upload(
        file,
        BucketNameEnum.SPD_TEMPLATE,
      );

      const documentPdf = await this.fileHelperService.convertAndUpload(
        file,
        BucketNameEnum.SPD_TEMPLATE,
      );

      const spdTemplate = await this.spdTemplateRepository.findOneBy({
        type,
        spdId,
      });
      if (spdTemplate) {
        await this.spdTemplateRepository.update(spdTemplate.id, {
          documentDocx,
          documentPdf: documentPdf as any,
        });
      } else {
        await this.spdTemplateRepository.insert({
          type,
          documentDocx,
          documentPdf: documentPdf as any,
          spdId,
        });
      }

      const presignedDownload =
        await this.minIOService.generatePresignedDownloadUrl(documentPdf);
      return { ...spdTemplate, presignedDownload };
    } catch (error) {
      throw error;
    }
  }

  async downloadSPDDocumentDocx(spdId: string, type: string) {
    try {
      const spd = await this.spdTemplateRepository.findOneBy({ spdId, type });
      if (!spd) {
        throw new Error('SPD not found');
      }
      if (!spd.documentDocx) {
        throw new Error('SPD Document not found');
      }

      // const presignedDownload = await this.minIOService.generatePresignedDownloadUrl(spd.documentPdf);

      const presignedDownload =
        await this.minIOService.generatePresignedDownloadUrl(spd.documentDocx);
      return { presignedDownload };
    } catch (error) {
      throw error;
    }
  }

  async downloadSPDDocumentPdf(spdId: string, type: string) {
    try {
      const spd = await this.spdTemplateRepository.findOneBy({ spdId, type });
      if (!spd) {
        throw new Error('SPD not found');
      }
      if (!spd.documentPdf) {
        throw new Error('SPD Document not found');
      }

      // const presignedDownload = await this.minIOService.generatePresignedDownloadUrl(spd.documentPdf);

      const presignedDownload =
        await this.minIOService.generatePresignedDownloadUrl(spd.documentPdf);
      return { presignedDownload };
    } catch (error) {
      throw error;
    }
  }

  async mergePdf() {
    const basePath = process.cwd();
    const file1 = join(basePath, '1.pdf');
    const file2 = join(basePath, '2.pdf');
    const pdfBuffer1 = fs.readFileSync(file1);
    const pdfBuffer2 = fs.readFileSync(file2);
    const pdfBuffers = [pdfBuffer1, pdfBuffer2];

    await this.documentManipulatorService.mergePdf(pdfBuffers);
  }
  async mergeDocx() {
    const basePath = process.cwd();
    const file1 = join(basePath, '1.docx');
    const file2 = join(basePath, '3.docx');
    const docxBuffers = [fs.readFileSync(file1), fs.readFileSync(file2)];

    await this.documentManipulatorService.mergeDocx(docxBuffers);
  }

  async merge() {
    return await this.documentManipulatorService.merge();
  }
}

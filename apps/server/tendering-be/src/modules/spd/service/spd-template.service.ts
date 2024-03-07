import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { DocxService } from 'src/shared/docx/docx.service';
import { MinIOService } from 'src/shared/min-io/min-io.service';
import { Response } from 'express';
import { SpdTemplate } from 'src/entities/spd-template.entity';
import { Readable } from 'stream';
import { FileHelperService } from '../../../shared/min-io/file-helper.service';

@Injectable()
export class SpdTemplateService extends ExtraCrudService<SpdTemplate> {
  constructor(
    @InjectRepository(SpdTemplate)
    private readonly spdTemplateRepository: Repository<SpdTemplate>,
    private readonly docxService: DocxService,
    private readonly minIOService: MinIOService,
    private readonly fileHelperService: FileHelperService,
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
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
      }
      const documentDocx = await this.minIOService.upload(file);

      const documentPdf = await this.fileHelperService.convertAndUpload(file);

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
}

import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { DocxService } from 'src/shared/docx/docx.service';
import { MinIOService } from 'src/shared/min-io/min-io.service';
import { Response } from 'express';
import { SpdBidForm } from 'src/entities/spd-bid-form.entity';
import { Readable } from 'stream';
import { FileHelperService } from './file-helper.service';

@Injectable()
export class SpdBidFormService extends ExtraCrudService<SpdBidForm> {
  constructor(
    @InjectRepository(SpdBidForm)
    private readonly spdBidFormRepository: Repository<SpdBidForm>,
    private readonly docxService: DocxService,
    private readonly minIOService: MinIOService,
    private readonly fileHelperService: FileHelperService,
  ) {
    super(spdBidFormRepository);
  }

  async uploadSPDDocument(payload: any, file: Express.Multer.File) {
    try {
      // const result = await this.docxService.validateDocument(file.buffer, [
      //   'public_body',
      // ]);

      // if (result.length != 0) {
      //   throw new HttpException(result, HttpStatus.BAD_REQUEST);
      // }

      const documentDocx = await this.minIOService.upload(file);

      const documentPdf = await this.fileHelperService.convertAndUpload(file);

      const data = this.spdBidFormRepository.create({
        spdId: payload.spdId,
        type: payload.type,
        code: payload.code,
        title: payload.title,
        documentDocx,
        documentPdf: documentPdf as any,
      });

      await this.spdBidFormRepository.insert(data);

      const presignedDownload =
        await this.minIOService.generatePresignedDownloadUrl(documentPdf);
      return { ...data, presignedDownload };
    } catch (error) {
      throw error;
    }
  }

  async downloadSPDDocumentDocx(id: string) {
    try {
      const spd = await this.spdBidFormRepository.findOneBy({ id });
      if (!spd) {
        throw new Error('SPD not found');
      }
      if (!spd.documentDocx) {
        throw new Error('SPD Document not found');
      }
      const presignedDownload =
        await this.minIOService.generatePresignedDownloadUrl(spd.documentDocx);
      return { presignedDownload };
    } catch (error) {
      throw error;
    }
  }

  async downloadSPDDocumentPdf(id: string) {
    try {
      const spd = await this.spdBidFormRepository.findOneBy({ id });
      if (!spd) {
        throw new Error('SPD not found');
      }
      if (!spd.documentPdf) {
        throw new Error('SPD Document not found');
      }
      const presignedDownload =
        await this.minIOService.generatePresignedDownloadUrl(spd.documentPdf);
      return { presignedDownload };
    } catch (error) {
      throw error;
    }
  }
}

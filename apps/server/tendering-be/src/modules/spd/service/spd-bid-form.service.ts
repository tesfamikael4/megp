import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import {
  MinIOService,
  BucketNameEnum,
  FileHelperService,
} from 'src/shared/min-io';
import { SpdBidForm } from 'src/entities/spd-bid-form.entity';
import { Response } from 'express';

@Injectable()
export class SpdBidFormService extends ExtraCrudService<SpdBidForm> {
  constructor(
    @InjectRepository(SpdBidForm)
    private readonly spdBidFormRepository: Repository<SpdBidForm>,
    private readonly minIOService: MinIOService,
    private readonly fileHelperService: FileHelperService,
  ) {
    super(spdBidFormRepository);
  }

  async uploadSPDDocument(payload: any, file: Express.Multer.File) {
    try {
      const documentDocx = await this.minIOService.upload(
        file,
        BucketNameEnum.SPD_BID_FORM,
      );

      const documentPdf = await this.fileHelperService.convertAndUpload(
        file,
        BucketNameEnum.SPD_BID_FORM,
      );

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

  async downloadSPDDocumentPdfBuffer(id: string, response: Response) {
    try {
      const spd = await this.spdBidFormRepository.findOneBy({ id });
      if (!spd) {
        throw new Error('SPD not found');
      }
      if (!spd.documentPdf) {
        throw new Error('SPD Document not found');
      }
      const result = await this.minIOService.download(
        spd.documentPdf,
        response,
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
}

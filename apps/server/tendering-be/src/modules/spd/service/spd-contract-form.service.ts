import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { MinIOService, BucketNameEnum } from 'src/shared/min-io';
import { SpdContractForm } from 'src/entities/spd-contract-form.entity';
import { FileHelperService } from 'src/shared/document-manipulator/file-helper.service';

@Injectable()
export class SpdContractFormService extends ExtraCrudService<SpdContractForm> {
  constructor(
    @InjectRepository(SpdContractForm)
    private readonly spdContractFormRepository: Repository<SpdContractForm>,
    private readonly minIOService: MinIOService,
    private readonly fileHelperService: FileHelperService,
  ) {
    super(spdContractFormRepository);
  }

  async uploadSPDDocument(payload: any, file: Express.Multer.File) {
    try {
      const documentDocx = await this.minIOService.upload(
        file,
        BucketNameEnum.SPD_CONTRACT_FORM,
      );

      const documentPdf = await this.fileHelperService.convertAndUpload(
        file,
        BucketNameEnum.SPD_CONTRACT_FORM,
      );

      const data = this.spdContractFormRepository.create({
        spdId: payload.spdId,
        type: payload.type,
        code: payload.code,
        title: payload.title,
        documentDocx,
        documentPdf: documentPdf as any,
      });

      await this.spdContractFormRepository.insert(data);

      const presignedDownload =
        await this.minIOService.generatePresignedDownloadUrl(documentPdf);
      return { ...data, presignedDownload };
    } catch (error) {
      throw error;
    }
  }

  async downloadSPDDocumentDocx(id: string) {
    try {
      const spd = await this.spdContractFormRepository.findOneBy({
        id,
      });
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
      const spd = await this.spdContractFormRepository.findOneBy({
        id,
      });
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

import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { DocxService } from 'src/shared/docx/docx.service';
import { MinIOService, BucketNameEnum } from 'src/shared/min-io';
import { SpdTemplate } from 'src/entities/spd-template.entity';
import { FileHelperService } from 'src/shared/document-manipulator/file-helper.service';
import { SpdTemplateEnum, SpdTemplateTypeEnum } from 'src/shared/enums';

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
      const validationProperties = this.getValidationProperties(type);

      const result = await this.docxService.validateDocument(
        file.buffer,
        validationProperties,
      );

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

  private getValidationProperties(type: string) {
    let validationProperties = [];
    if (type == SpdTemplateTypeEnum.MAIN_DOCUMENT) {
      validationProperties = [
        SpdTemplateEnum.PUBLIC_BODY,
        SpdTemplateEnum.BDS,
        SpdTemplateEnum.SCC,
      ];
    } else if (type === SpdTemplateTypeEnum.BDS) {
      validationProperties = [
        SpdTemplateEnum.PUBLIC_BODY,
        SpdTemplateEnum.CLARIFICATION_DEADLINE_DATE,
        SpdTemplateEnum.CLARIFICATION_DEADLINE_TIME,
        SpdTemplateEnum.INCOTERM_EDITION,
        SpdTemplateEnum.OPENING_DATE_DATE,
        SpdTemplateEnum.OPENING_DATE_TIME,
      ];
    } else if (type === SpdTemplateTypeEnum.SCC) {
      validationProperties = [
        SpdTemplateEnum.PUBLIC_BODY,
        SpdTemplateEnum.PROCUREMENT_REFERENCE_NO,
      ];
    } else if (type === SpdTemplateTypeEnum.BID_SECURITY) {
      validationProperties = [
        SpdTemplateEnum.PUBLIC_BODY,
        SpdTemplateEnum.BIDDER_NAME,
        SpdTemplateEnum.BID_DATE,
        SpdTemplateEnum.NAME_OF_CONTRACT,
        SpdTemplateEnum.BANK_NAME,
        SpdTemplateEnum.COUNTRY,
        SpdTemplateEnum.DAY,
        SpdTemplateEnum.MONTH,
        SpdTemplateEnum.YEAR,
      ];
    } else {
      validationProperties = [SpdTemplateEnum.PUBLIC_BODY];
    }
    return validationProperties;
  }
}

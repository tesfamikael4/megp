import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { DocxService } from 'src/shared/docx/docx.service';
import { MinIOService } from 'src/shared/min-io/min-io.service';
import { Response } from 'express';
import { SpdContractForm } from 'src/entities/spd-contract-form.entity';
import { Readable } from 'stream';
import { FileHelperService } from './file-helper.service';

@Injectable()
export class SpdContractFormService extends ExtraCrudService<SpdContractForm> {
  constructor(
    @InjectRepository(SpdContractForm)
    private readonly spdContractFormRepository: Repository<SpdContractForm>,
    private readonly docxService: DocxService,
    private readonly minIOService: MinIOService,
    private readonly fileHelperService: FileHelperService,
  ) {
    super(spdContractFormRepository);
  }

  async uploadSPDDocument(
    payload: any,
    file: Express.Multer.File,
    response: Response,
  ) {
    try {
      // const result = await this.docxService.validateDocument(file.buffer, [
      //   'public_body',
      // ]);

      // if (result.length != 0) {
      //   throw new HttpException(result, HttpStatus.BAD_REQUEST);
      // }

      const documentDocx = await this.minIOService.upload(file);

      const documentPdf = await this.fileHelperService.convertAndUpload(file);

      await this.spdContractFormRepository.insert({
        spdId: payload.spdId,
        type: payload.type,
        code: payload.code,
        title: payload.title,
        documentDocx,
        documentPdf: documentPdf.fileInfo,
      });

      response.setHeader('Content-Type', documentPdf.fileInfo.contentType);
      response.setHeader(
        'Content-Disposition',
        `attachment; filename=${documentPdf.fileInfo.filepath}`,
      );
      const download = Readable.from(documentPdf.buffer).pipe(response);

      return download;
    } catch (error) {
      throw error;
    }
  }

  async downloadSPDDocumentDocx(id: string, response: Response) {
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
      return await this.minIOService.download(spd.documentDocx, response);
    } catch (error) {
      throw error;
    }
  }

  async downloadSPDDocumentPdf(id: string, response: Response) {
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
      return await this.minIOService.download(spd.documentPdf, response);
    } catch (error) {
      throw error;
    }
  }
}

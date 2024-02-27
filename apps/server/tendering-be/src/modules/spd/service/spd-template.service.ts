import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { DocxService } from 'src/shared/docx/docx.service';
import { MinIOService } from 'src/shared/min-io/min-io.service';
import { Response } from 'express';
import { SpdTemplate } from 'src/entities/spd-template.entity';
import { extname, join } from 'path';
import { PDFEngine } from 'chromiumly';
import { unlink, writeFile } from 'fs';
import { Readable } from 'stream';

@Injectable()
export class SpdTemplateService extends ExtraCrudService<SpdTemplate> {
  constructor(
    @InjectRepository(SpdTemplate)
    private readonly spdTemplateRepository: Repository<SpdTemplate>,
    private readonly docxService: DocxService,
    private readonly minIOService: MinIOService,
  ) {
    super(spdTemplateRepository);
  }

  async uploadSPDDocument(
    spdId: string,
    type: string,
    file: Express.Multer.File,
    response: Response,
  ) {
    try {
      const result = await this.docxService.validateDocument(file.buffer, [
        'public_body',
      ]);

      if (result.length != 0) {
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
      }
      const documentDocx = await this.minIOService.upload(file);

      const documentPdf = await this.convertAndUpload(file);

      const spdTemplate = await this.spdTemplateRepository.findOneBy({
        type,
        spdId,
      });
      if (spdTemplate) {
        await this.spdTemplateRepository.update(spdTemplate.id, {
          documentDocx,
          documentPdf: documentPdf.fileInfo,
        });
      } else {
        await this.spdTemplateRepository.insert({
          type,
          documentDocx,
          documentPdf: documentPdf.fileInfo,
          spdId,
        });
      }

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

  async downloadSPDDocumentDocx(
    spdId: string,
    type: string,
    response: Response,
  ) {
    try {
      const spd = await this.spdTemplateRepository.findOneBy({ spdId, type });
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

  async downloadSPDDocumentPdf(
    spdId: string,
    type: string,
    response: Response,
  ) {
    try {
      const spd = await this.spdTemplateRepository.findOneBy({ spdId, type });
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

  private async convertAndUpload(file: Express.Multer.File) {
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

    return { fileInfo, buffer };
  }
}

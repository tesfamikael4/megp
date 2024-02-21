import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { DocxService } from 'src/shared/docx/docx.service';
import { MinIOService } from 'src/shared/min-io/min-io.service';
import { Response } from 'express';
import { SpdTemplate } from 'src/entities/spd-template.entity';

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
    payload: { spdId: string; type: string },
    file: Express.Multer.File,
  ) {
    try {
      const result = await this.docxService.validateDocument(file.buffer, [
        'public_body',
      ]);

      if (result.length != 0) {
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
      }
      const document = await this.minIOService.upload(file);

      const spdTemplate = await this.spdTemplateRepository.findOneBy({
        type: payload.type,
        spdId: payload.spdId,
      });
      if (spdTemplate) {
        await this.spdTemplateRepository.update(spdTemplate.id, { document });
      } else {
        await this.spdTemplateRepository.insert({
          type: payload.type,
          document,
          spdId: payload.spdId,
        });
      }

      return spdTemplate;
    } catch (error) {
      throw error;
    }
  }

  async downloadSPDDocument(spdId: string, type: string, response: Response) {
    try {
      const spd = await this.spdTemplateRepository.findOneBy({ spdId, type });
      if (!spd) {
        throw new Error('SPD not found');
      }
      if (!spd.document) {
        throw new Error('SPD Document not found');
      }
      return await this.minIOService.download(spd.document, response);
    } catch (error) {
      throw error;
    }
  }
}

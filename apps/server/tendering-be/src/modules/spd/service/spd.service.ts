import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service';
import { Spd } from 'src/entities/spd.entity';
import { DocxService } from 'src/shared/docx/docx.service';
import { MinIOService } from 'src/shared/min-io/min-io.service';
import { Response } from 'express';

@Injectable()
export class SpdService extends EntityCrudService<Spd> {
  constructor(
    @InjectRepository(Spd)
    private readonly spdRepository: Repository<Spd>,
    private readonly docxService: DocxService,
    private readonly minIOService: MinIOService,
  ) {
    super(spdRepository);
  }

  async uploadSPDDocument(id: string, file: Express.Multer.File) {
    try {
      const spd = await this.findOne(id);
      if (!spd) {
        throw new Error('SPD not found');
      }

      const result = await this.docxService.validateDocument(file.buffer, [
        'public_body',
      ]);

      if (result.length != 0) {
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
      }
      const document = await this.minIOService.upload(file);

      await this.spdRepository.update(spd.id, { document });

      return document;
    } catch (error) {
      throw error;
    }
  }

  async downloadSPDDocument(id: string, response: Response) {
    try {
      const spd = await this.findOne(id);
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

import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
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

  async uploadSPDDocument(file: Express.Multer.File) {
    try {
      const result = await this.docxService.validateDocument(file.buffer, [
        'procuringEntity',
      ]);
      if (result.length != 0) {
        return result;
      }
      return await this.minIOService.upload(file);
    } catch (error) {
      throw error;
    }
  }

  async downloadSPDDocument(fileInfo: any, response: Response) {
    try {
      return await this.minIOService.download(fileInfo, response);
    } catch (error) {
      throw error;
    }
  }
}

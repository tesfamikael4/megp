import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';
import { SorDocument } from 'src/entities/sor-document.entity';

@Injectable()
export class SorDocumentService extends ExtraCrudService<SorDocument> {
  constructor(
    @InjectRepository(SorDocument)
    private readonly sorDocumentRepository: Repository<SorDocument>,
  ) {
    super(sorDocumentRepository);
  }
}

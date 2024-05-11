import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraCrudService } from 'megp-shared-be';
import { RfxNote } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class RfxNoteService extends ExtraCrudService<RfxNote> {
  constructor(
    @InjectRepository(RfxNote)
    private readonly rfxNoteRepository: Repository<RfxNote>,
  ) {
    super(rfxNoteRepository);
  }
}

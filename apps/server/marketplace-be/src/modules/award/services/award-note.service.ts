import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraCrudService } from 'megp-shared-be';
import { AwardNote } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class AwardNoteService extends ExtraCrudService<AwardNote> {
  constructor(
    @InjectRepository(AwardNote)
    private readonly awardNoteRepository: Repository<AwardNote>,
  ) {
    super(awardNoteRepository);
  }
}

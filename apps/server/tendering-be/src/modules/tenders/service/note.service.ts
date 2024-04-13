import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class NoteService extends ExtraCrudService<Note> {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
  ) {
    super(noteRepository);
  }
}

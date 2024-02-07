import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notes } from 'src/entities/note.entity';
import { EntityCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class NotesService extends EntityCrudService<Notes> {
  constructor(
    @InjectRepository(Notes)
    private readonly repositoryNotes: Repository<Notes>,
  ) {
    super(repositoryNotes);
  }
}

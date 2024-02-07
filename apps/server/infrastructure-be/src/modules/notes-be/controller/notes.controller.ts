import { Controller } from '@nestjs/common';
import { Notes } from 'src/entities/note.entity';
import { EntityCrudController } from 'src/shared/controller';
import { NotesService } from '../service/notes.service';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { CreateNotesDto, UpdateNotesDto } from '../dto/notes.dto';
import { ApiTags } from '@nestjs/swagger';

const options: EntityCrudOptions = {
  createDto: CreateNotesDto,
  updateDto: UpdateNotesDto,
};

@Controller('notes')
@ApiTags('notes')
export class NotesController extends EntityCrudController<Notes>(options) {
  constructor(private readonly notesService: NotesService) {
    super(notesService);
  }
}

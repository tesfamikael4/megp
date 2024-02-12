import { Controller } from '@nestjs/common';
import { Notes } from 'src/entities/note.entity';
import { EntityCrudController } from 'megp-shared-be';
import { NotesService } from '../service/notes.service';
import { EntityCrudOptions } from 'megp-shared-be';
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

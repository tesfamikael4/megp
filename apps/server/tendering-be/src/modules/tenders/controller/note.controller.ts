import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Note } from 'src/entities';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { NoteService } from '../service';
import { CreateNoteDto, UpdateNoteDto } from '../dto';

const options: ExtraCrudOptions = {
  entityIdName: 'tenderId',
  createDto: CreateNoteDto,
  updateDto: UpdateNoteDto,
};

@ApiBearerAuth()
@Controller('notes')
@ApiTags('Note Controller')
export class NoteController extends ExtraCrudController<Note>(options) {
  constructor(private readonly noteService: NoteService) {
    super(noteService);
  }
}

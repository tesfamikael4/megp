import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExtraCrudOptions, ExtraCrudController } from 'megp-shared-be';

import { CreateNoteDto, UpdateNoteDto } from '../dtos/rfx-note.dto';
import { RfxNote } from 'src/entities/rfx-note.entity';
import { RfxNoteService } from '../services/rfx-note.service';

const options: ExtraCrudOptions = {
  entityIdName: 'rfxId',
  createDto: CreateNoteDto,
  updateDto: UpdateNoteDto,
};

@ApiBearerAuth()
@Controller('rfx-notes')
@ApiTags('Rfx Notes')
export class RfxNoteController extends ExtraCrudController<RfxNote>(options) {
  constructor(private readonly rfxNoteService: RfxNoteService) {
    super(rfxNoteService);
  }
}

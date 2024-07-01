import { Controller } from '@nestjs/common';
import { ExtraCrudController } from 'megp-shared-be';
import { ApiTags } from '@nestjs/swagger';
import { AwardNote } from 'src/entities';
import { AwardNoteService } from '../services/award-note.service';
import { CreateAwardNoteDTO, UpdateAwardNoteDTO } from '../dtos/award-note.dto';

const option = {
  entityIdName: 'rfxId',
  createDto: CreateAwardNoteDTO,
  updateDto: UpdateAwardNoteDTO,
};

@Controller('award-notes')
@ApiTags('Award Notes')
export class AwardNoteController extends ExtraCrudController<AwardNote>(
  option,
) {
  constructor(
    private readonly rfxTechnicalRequirementService: AwardNoteService,
  ) {
    super(rfxTechnicalRequirementService);
  }
}

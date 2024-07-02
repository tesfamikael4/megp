import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  ExtraCrudController,
  ExtraCrudOptions,
  decodeCollectionQuery,
} from 'megp-shared-be';
import {
  CreateAcceptanceNoteDto,
  UpdateAcceptanceNoteDto,
} from '../dtos/acceptance-note.dto';
import { AcceptanceNote } from 'src/entities';
import { AcceptanceNoteService } from '../services/acceptance-note.service';
const options: ExtraCrudOptions = {
  entityIdName: 'purchaseOrderId',
  createDto: CreateAcceptanceNoteDto,
  updateDto: UpdateAcceptanceNoteDto,
};

@ApiBearerAuth()
@Controller('acceptance-notes')
@ApiTags('AcceptanceNote')
export class AcceptanceNoteController extends ExtraCrudController<AcceptanceNote>(
  options,
) {
  constructor(private readonly acceptanceNoteService: AcceptanceNoteService) {
    super(acceptanceNoteService);
  }

  @Get('all')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  async getAll(@CurrentUser() user: any, @Query('q') q?: string) {
    const query = decodeCollectionQuery(q);
    return await this.acceptanceNoteService.getAll(query);
  }
}

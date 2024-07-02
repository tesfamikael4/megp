import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  ExtraCrudController,
  ExtraCrudOptions,
  decodeCollectionQuery,
} from 'megp-shared-be';
import {
  CreateReceivingNoteDto,
  UpdateReceivingNoteDto,
} from '../dtos/receiving-note.dto';
import { ReceivingNote } from 'src/entities';
import { ReceivingNoteService } from '../services/receiving-note.service';
const options: ExtraCrudOptions = {
  entityIdName: 'poShipmentId',
  createDto: CreateReceivingNoteDto,
  updateDto: UpdateReceivingNoteDto,
};

@ApiBearerAuth()
@Controller('receiving-notes')
@ApiTags('ReceivingNote')
export class ReceivingNoteController extends ExtraCrudController<ReceivingNote>(
  options,
) {
  constructor(private readonly receivingNoteService: ReceivingNoteService) {
    super(receivingNoteService);
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
    return await this.receivingNoteService.getAll(query);
  }
}

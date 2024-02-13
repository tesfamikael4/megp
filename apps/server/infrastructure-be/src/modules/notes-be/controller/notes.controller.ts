import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Notes } from 'src/entities/note.entity';
import { EntityCrudController } from 'megp-shared-be';
import { NotesService } from '../service/notes.service';
import { EntityCrudOptions } from 'megp-shared-be';
import { CreateNotesDto, UpdateNotesDto } from '../dto/notes.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'megp-shared-be';

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
  @Post()
  async create(
    @Body() itemData: CreateNotesDto,
    @CurrentUser() user: any,
  ): Promise<Notes> {
    itemData.organizationId = user.organization.id;
    itemData.metaData = { userId: user.id };
    return this.notesService.create(itemData);
  }

  @Get('/:objectId')
  async getNote(@Param('objectId') objectId: string) {
    return await this.notesService.getNote(objectId);
  }
}

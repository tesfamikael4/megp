import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  ExtraCrudOptions,
  ExtraCrudController,
  decodeCollectionQuery,
} from 'megp-shared-be';
import { SolBookmarkService } from '../services/bookmark.service';
import { SolBookmark } from 'src/entities';
import { CreateBookmarkDto, UpdateBookmarkDto } from '../dtos/bookmark.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'rfxId',
  createDto: CreateBookmarkDto,
  updateDto: UpdateBookmarkDto,
};

@ApiBearerAuth()
@Controller('sol-bookmarks')
@ApiTags('Sol Bookmarks')
export class SolBookmarkController extends ExtraCrudController<SolBookmark>(
  options,
) {
  constructor(private readonly solBookmarkService: SolBookmarkService) {
    super(solBookmarkService);
  }

  @Get('my-bookmarks')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  async getMyBookmarks(@Query('q') q: string, @Req() req?: any) {
    const query = decodeCollectionQuery(q);
    return this.solBookmarkService.getMyBookmarks(query, req);
  }

  @Get('my-registartions')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  async getMyRegistered(@Query('q') q: string, @Req() req?: any) {
    const query = decodeCollectionQuery(q);
    return this.solBookmarkService.getMyRegisteredRfx(query, req);
  }
}

import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BidBookmark } from 'src/entities/bid-bookmark.entity';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { BidBookmarkService } from '../service/bid-bookmark.service';
import { ExtraCrudController } from 'src/shared/controller';
import { CreateBidBookmarkDto } from '../dto/bid-bookmark.dto';
import { decodeCollectionQuery } from 'src/shared/collection-query';
import { JwtGuard } from 'src/shared/authorization';
import { VendorGuard } from 'src/shared/authorization/guards/vendor.guard';

const options: ExtraCrudOptions = {
  entityIdName: 'tenderId',
  createDto: CreateBidBookmarkDto,
};

@ApiBearerAuth()
@Controller('bid-bookmarks')
@ApiTags('Bid Bookmark Controller')
@UseGuards(JwtGuard, VendorGuard())
export class BidBookmarkController extends ExtraCrudController<BidBookmark>(
  options,
) {
  constructor(private readonly bidSecurityService: BidBookmarkService) {
    super(bidSecurityService);
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
    return this.bidSecurityService.getMyBookmarks(query, req);
  }
}

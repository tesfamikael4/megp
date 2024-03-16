import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BidBookmark } from 'src/entities/bid-bookmark.entity';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { BidBookmarkService } from '../service/bid-bookmark.service';
import { ExtraCrudController } from 'src/shared/controller';

const options: ExtraCrudOptions = {
  entityIdName: 'tenderId',
};

@ApiBearerAuth()
@Controller('bid-bookmarks')
@ApiTags('Bid Bookmark Controller')
export class BidBookmarkController extends ExtraCrudController<BidBookmark>(
  options,
) {
  constructor(private readonly bidSecurityService: BidBookmarkService) {
    super(bidSecurityService);
  }
}

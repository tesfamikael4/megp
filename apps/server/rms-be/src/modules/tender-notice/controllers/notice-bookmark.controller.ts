import { Controller } from '@nestjs/common';
import { NoticeBookmark } from 'src/entities';
import {
  AllowAnonymous,
  ExtraCrudController,
  ExtraCrudOptions,
} from 'megp-shared-be';
import { ApiTags } from '@nestjs/swagger';
import { NoticeBookmarkService } from '../services/notice-bookmark.service';
import { EventPattern } from '@nestjs/microservices';

const options: ExtraCrudOptions = {
  entityIdName: 'noticeId',
};

@Controller('notice-bookmarks')
@ApiTags('Tender Notices')
export class NoticeBookmarkController extends ExtraCrudController<NoticeBookmark>(
  options,
) {
  constructor(private readonly noticeBookmarkService: NoticeBookmarkService) {
    super(noticeBookmarkService);
  }

  @EventPattern('record-bookmark')
  @AllowAnonymous()
  async listen(payload: any) {
    payload.noticeId = payload.rfxId || payload.tenderId;
    return await this.noticeBookmarkService.create(payload);
  }
}

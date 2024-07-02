import { Injectable } from '@nestjs/common';
import { NoticeBookmark, TenderNotice } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'megp-shared-be';

@Injectable()
export class NoticeBookmarkService extends ExtraCrudService<NoticeBookmark> {
  constructor(
    @InjectRepository(NoticeBookmark)
    private readonly noticeBookmarkRepository: Repository<NoticeBookmark>,
  ) {
    super(noticeBookmarkRepository);
  }
}

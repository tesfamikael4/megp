import { Module } from '@nestjs/common';
import { TenderNoticeService } from './services/tender-notice.service';
import { TenderNoticeController } from './controllers/tender-notice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticeRegistration, TenderNotice } from 'src/entities';
import { NoticeBookmark } from '../../entities';
import { NoticeBookmarkService } from './services/notice-bookmark.service';
import { NoticeRegistrationService } from './services/notice-registration.service';
import { NoticeBookmarkController } from './controllers/notice-bookmark.controller';
import { NoticeRegistrationController } from './controllers/notice-registraiton.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TenderNotice,
      NoticeBookmark,
      NoticeRegistration,
    ]),
  ],
  controllers: [
    TenderNoticeController,
    NoticeBookmarkController,
    NoticeRegistrationController,
  ],
  providers: [
    TenderNoticeService,
    NoticeBookmarkService,
    NoticeRegistrationService,
  ],
})
export class TenderNoticeModule {}

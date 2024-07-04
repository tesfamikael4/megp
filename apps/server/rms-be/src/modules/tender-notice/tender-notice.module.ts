import { Module } from '@nestjs/common';
import { TenderNoticeService } from './services/tender-notice.service';
import { TenderNoticeController } from './controllers/tender-notice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavedNotice, TenderNotice } from 'src/entities';
import { SavedNoticeService } from './services/saved-notice.service';
import { SavedNoticeController } from './controllers/saved-notice.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TenderNotice, SavedNotice])],
  controllers: [TenderNoticeController, SavedNoticeController],
  providers: [TenderNoticeService, SavedNoticeService],
})
export class TenderNoticeModule {}

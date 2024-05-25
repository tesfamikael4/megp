import { Module } from '@nestjs/common';
import { TenderNoticeService } from './services/tender-notice.service';
import { TenderNoticeController } from './controllers/tender-notice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenderNotice } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([TenderNotice])],
  controllers: [TenderNoticeController],
  providers: [TenderNoticeService],
})
export class TenderNoticeModule {}

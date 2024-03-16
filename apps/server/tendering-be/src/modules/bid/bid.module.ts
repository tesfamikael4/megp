import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BidBookmark } from 'src/entities/bid-bookmark.entity';
import { BidBookmarkController } from './controller/bid-bookmark.controller';
import { BidBookmarkService } from './service/bid-bookmark.service';

@Module({
  imports: [TypeOrmModule.forFeature([BidBookmark])],
  controllers: [BidBookmarkController],
  providers: [BidBookmarkService],
})
export class BidModule {}

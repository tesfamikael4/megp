import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BidBookmark } from 'src/entities/bid-bookmark.entity';
import { BidBookmarkController } from './controller/bid-bookmark.controller';
import { BidBookmarkService } from './service/bid-bookmark.service';
import { BidRegistration } from 'src/entities/bid-registration.entity';
import { Organization } from 'src/external-entities/external-organization.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BidBookmark, BidRegistration, Organization]),
  ],
  controllers: [BidBookmarkController],
  providers: [BidBookmarkService],
})
export class BidModule {}

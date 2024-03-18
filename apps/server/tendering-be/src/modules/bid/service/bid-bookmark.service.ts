import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BidBookmark } from 'src/entities/bid-bookmark.entity';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class BidBookmarkService extends ExtraCrudService<BidBookmark> {
  constructor(
    @InjectRepository(BidBookmark)
    private readonly bidSecurityRepository: Repository<BidBookmark>,
  ) {
    super(bidSecurityRepository);
  }
}

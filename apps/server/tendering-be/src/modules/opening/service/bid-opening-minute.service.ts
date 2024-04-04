import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { BidOpeningMinute } from 'src/entities/bid-opening-minute.entity';

@Injectable()
export class BidOpeningMinuteService extends ExtraCrudService<BidOpeningMinute> {
  constructor(
    @InjectRepository(BidOpeningMinute)
    private readonly bidOpeningMinuteRepository: Repository<BidOpeningMinute>,
  ) {
    super(bidOpeningMinuteRepository);
  }
}

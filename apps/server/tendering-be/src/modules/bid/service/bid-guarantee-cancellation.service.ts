import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BidGuaranteeCancellation } from 'src/entities/bid-guarantee-cancellation.entity';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';
@Injectable()
export class BidGuaranteeCancellationService extends ExtraCrudService<BidGuaranteeCancellation> {
  constructor(
    @InjectRepository(BidGuaranteeCancellation)
    private readonly bidGuaranteeCancellationRepository: Repository<BidGuaranteeCancellation>,
  ) {
    super(bidGuaranteeCancellationRepository);
  }
}

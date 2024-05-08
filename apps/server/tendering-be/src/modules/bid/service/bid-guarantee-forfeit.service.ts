import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BidGuaranteeForfeit } from 'src/entities/bid-guarantee-forfeit.entity';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';
@Injectable()
export class BidGuaranteeForfeitService extends ExtraCrudService<BidGuaranteeForfeit> {
  constructor(
    @InjectRepository(BidGuaranteeForfeit)
    private readonly bidGuaranteeForfeitRepository: Repository<BidGuaranteeForfeit>,
  ) {
    super(bidGuaranteeForfeitRepository);
  }
}

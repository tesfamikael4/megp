import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BidGuaranteeRelease } from 'src/entities/bid-guarantee-release.entity';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';
@Injectable()
export class BidGuaranteeReleaseService extends ExtraCrudService<BidGuaranteeRelease> {
  constructor(
    @InjectRepository(BidGuaranteeRelease)
    private readonly bidGuaranteeReleaseRepository: Repository<BidGuaranteeRelease>,
  ) {
    super(bidGuaranteeReleaseRepository);
  }
}

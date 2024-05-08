import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BidGuaranteeExtension } from 'src/entities/bid-guarantee-extension.entity';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class BidGuaranteeExtensionService extends ExtraCrudService<BidGuaranteeExtension> {
  constructor(
    @InjectRepository(BidGuaranteeExtension)
    private readonly bidGuaranteeExtensionRepository: Repository<BidGuaranteeExtension>,
  ) {
    super(bidGuaranteeExtensionRepository);
  }
}

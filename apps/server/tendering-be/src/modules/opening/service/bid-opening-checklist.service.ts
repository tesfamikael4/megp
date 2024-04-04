import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { BidOpeningChecklist } from 'src/entities/bid-opening-checklist.entity';

@Injectable()
export class BidOpeningChecklistService extends ExtraCrudService<BidOpeningChecklist> {
  constructor(
    @InjectRepository(BidOpeningChecklist)
    private readonly bidOpeningChecklistsRepository: Repository<BidOpeningChecklist>,
  ) {
    super(bidOpeningChecklistsRepository);
  }
}

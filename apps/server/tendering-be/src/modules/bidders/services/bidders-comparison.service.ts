import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { BiddersComparison } from 'src/entities/bidders-comparison.entity';

@Injectable()
export class BiddersComparisonService extends ExtraCrudService<BiddersComparison> {
  constructor(
    @InjectRepository(BiddersComparison)
    private readonly biddersComparisonRepository: Repository<BiddersComparison>,
  ) {
    super(biddersComparisonRepository);
  }
}

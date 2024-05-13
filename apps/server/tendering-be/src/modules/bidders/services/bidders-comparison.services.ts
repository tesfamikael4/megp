import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { REQUEST } from '@nestjs/core';
import { BiddersComparison } from 'src/entities/bidders-comparison.entity';

@Injectable()
export class BiddersComparisonService extends ExtraCrudService<BiddersComparison> {
  constructor(
    @InjectRepository(BiddersComparison)
    private readonly biddersComparisonRepository: Repository<BiddersComparison>,

    @Inject(REQUEST) private request: Request,
  ) {
    super(biddersComparisonRepository);
  }
}

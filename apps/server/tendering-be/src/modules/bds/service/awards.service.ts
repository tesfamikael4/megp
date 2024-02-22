import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BdsAward } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class BdsAwardService extends ExtraCrudService<BdsAward> {
  constructor(
    @InjectRepository(BdsAward)
    private readonly bdsAwardRepository: Repository<BdsAward>,
  ) {
    super(bdsAwardRepository);
  }
}

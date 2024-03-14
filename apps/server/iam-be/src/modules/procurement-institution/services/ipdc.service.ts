import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { IPDC } from '@entities';
import { ExtraCrudService } from 'src/shared/service';

@Injectable()
export class IPDCService extends ExtraCrudService<IPDC> {
  constructor(
    @InjectRepository(IPDC)
    private readonly iPDCRepository: Repository<IPDC>,
  ) {
    super(iPDCRepository);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { TenderPersonal } from 'src/entities';

@Injectable()
export class TenderPersonalService extends ExtraCrudService<TenderPersonal> {
  constructor(
    @InjectRepository(TenderPersonal)
    private readonly tenderPersonalRepository: Repository<TenderPersonal>,
  ) {
    super(tenderPersonalRepository);
  }
}

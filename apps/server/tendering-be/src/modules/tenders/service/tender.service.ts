import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tender } from 'src/entities';
import { EntityCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class TenderService extends EntityCrudService<Tender> {
  constructor(
    @InjectRepository(Tender)
    private readonly tenderRepository: Repository<Tender>,
  ) {
    super(tenderRepository);
  }
}

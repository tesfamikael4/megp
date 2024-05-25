import { Injectable } from '@nestjs/common';
import { TenderNotice } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityCrudService } from 'megp-shared-be';

@Injectable()
export class TenderNoticeService extends EntityCrudService<TenderNotice> {
  constructor(
    @InjectRepository(TenderNotice)
    private readonly tenderNoticeRepository: Repository<TenderNotice>,
  ) {
    super(tenderNoticeRepository);
  }
}

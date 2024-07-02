import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraCrudService } from 'megp-shared-be';
import { POTerm } from 'src/entities';

import { Repository } from 'typeorm';

@Injectable()
export class POTermService extends ExtraCrudService<POTerm> {
  constructor(
    @InjectRepository(POTerm)
    private readonly poTermRepository: Repository<POTerm>,
  ) {
    super(poTermRepository);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraCrudService } from 'megp-shared-be';
import { POItem } from 'src/entities';

import { Repository } from 'typeorm';

@Injectable()
export class POItemService extends ExtraCrudService<POItem> {
  constructor(
    @InjectRepository(POItem)
    private readonly poItemRepository: Repository<POItem>,
  ) {
    super(poItemRepository);
  }
}

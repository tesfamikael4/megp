import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraCrudService } from 'megp-shared-be';
import { ItemBudgetSource } from 'src/entities';

import { Repository } from 'typeorm';

@Injectable()
export class ItemBudgetSourceService extends ExtraCrudService<ItemBudgetSource> {
  constructor(
    @InjectRepository(ItemBudgetSource)
    private readonly itemBudgetSourceRepository: Repository<ItemBudgetSource>,
  ) {
    super(itemBudgetSourceRepository);
  }
}

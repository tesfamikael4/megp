import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ItemBudgetLine } from 'src/entities';
import { RelationCrudService } from 'src/shared/service';

@Injectable()
export class ItemBudgetLineService extends RelationCrudService<ItemBudgetLine> {
  constructor(
    @InjectRepository(ItemBudgetLine)
    private readonly repositoryItemBudgetLine: Repository<ItemBudgetLine>,
  ) {
    super(repositoryItemBudgetLine);
  }
}

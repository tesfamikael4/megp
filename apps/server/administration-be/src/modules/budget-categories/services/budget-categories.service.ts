import { Injectable } from '@nestjs/common';
import { BudgetCategory } from '@entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityCrudService } from '@generic-services';

@Injectable()
export class BudgetCategoriesService extends EntityCrudService<BudgetCategory> {
  constructor(
    @InjectRepository(BudgetCategory)
    private readonly categoryRepository: Repository<BudgetCategory>,
  ) {
    super(categoryRepository);
  }
}

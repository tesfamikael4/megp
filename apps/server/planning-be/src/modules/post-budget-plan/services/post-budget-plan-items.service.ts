import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostBudgetPlanItems } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';

@Injectable()
export class PostBudgetPlanItemsService extends ExtraCrudService<PostBudgetPlanItems> {
  constructor(
    @InjectRepository(PostBudgetPlanItems)
    private readonly repositoryPostBudgetPlanItems: Repository<PostBudgetPlanItems>,
  ) {
    super(repositoryPostBudgetPlanItems);
  }
}

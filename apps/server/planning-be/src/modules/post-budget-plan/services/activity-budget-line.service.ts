import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { ActivityBudgetLine } from 'src/entities/activity-budget-line.entity';

@Injectable()
export class ActivityBudgetLineService extends ExtraCrudService<ActivityBudgetLine> {
  constructor(
    @InjectRepository(ActivityBudgetLine)
    private readonly repositoryActivityBudgetLine: Repository<ActivityBudgetLine>,
  ) {
    super(repositoryActivityBudgetLine);
  }
}

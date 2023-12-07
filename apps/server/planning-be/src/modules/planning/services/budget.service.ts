import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { APP, PreBudgetPlan } from 'src/entities';
import { EntityCrudService, ExtraCrudService } from 'src/shared/service';
import { Budget } from 'src/entities/budget.entity';

@Injectable()
export class BudgetService extends ExtraCrudService<Budget> {
  constructor(
    @InjectRepository(Budget)
    private readonly repositoryBudget: Repository<Budget>,
  ) {
    super(repositoryBudget);
  }

  async bulkCreate(data: any): Promise<Budget[]> {
    try {
      const budget = await this.repositoryBudget.find({
        where: { appId: data.appId },
      });
      if (budget.length > 0) {
        await this.repositoryBudget.delete(budget as any);
      }
      const items = data.budgets.map((budget) => ({
        ...budget,
        appId: data.appId,
      }));
      await this.repositoryBudget.create(items);
      return await this.repositoryBudget.save(items);
    } catch (err) {
      console.log(err);
    }
  }
}

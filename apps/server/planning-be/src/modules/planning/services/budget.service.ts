import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { APP } from 'src/entities';
import { Budget } from 'src/entities/budget.entity';
import { ExtraCrudService } from 'src/shared/service';

@Injectable()
export class BudgetService extends ExtraCrudService<Budget> {
  constructor(
    @InjectRepository(Budget)
    private readonly repositoryBudget: Repository<Budget>,
    @InjectRepository(APP)
    private readonly repositoryApp: Repository<APP>,
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
      const app = await this.repositoryApp.findOneBy({
        id: data.appId,
      });
      const items = data.budgets.map((budget) => ({
        ...budget,
        appId: data.appId,
        budgetYearId: app.budgetYearId,
        organizationId: app.organizationId,
      }));
      await this.repositoryBudget.create(items);
      return await this.repositoryBudget.save(items);
    } catch (err) {
      console.log(err);
    }
  }
}

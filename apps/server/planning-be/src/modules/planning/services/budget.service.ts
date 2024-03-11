import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { APP } from 'src/entities';
import { Budget } from 'src/entities/budget.entity';
import { ExtraCrudService } from 'src/shared/service';
import { REQUEST } from '@nestjs/core';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';

@Injectable()
export class BudgetService extends ExtraCrudService<Budget> {
  constructor(
    @InjectRepository(Budget)
    private readonly repositoryBudget: Repository<Budget>,
    @InjectRepository(APP)
    private readonly repositoryApp: Repository<APP>,
    @Inject(REQUEST)
    private readonly request: Request,
  ) {
    super(repositoryBudget);
  }

  async bulkCreate(data: any): Promise<Budget[]> {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    try {
      const budget = await this.repositoryBudget.find({
        where: { appId: data.appId },
      });
      if (budget.length > 0) {
        await entityManager.getRepository(Budget).delete(budget as any);
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
      const result = await this.repositoryBudget.create(items);
      await entityManager.getRepository(Budget).insert(result);
      return result;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getSummation(organizationId: string, budgetYearId: string) {
    const budgets = await this.repositoryBudget.find({
      where: { organizationId, budgetYearId },
    });
    const resp = {};
    budgets.forEach((budget) => {
      const amount =
        budget.revisedBudget == 0
          ? budget.allocatedBudget
          : budget.revisedBudget;
      resp[budget.currency]
        ? (resp[budget.currency] += +amount)
        : (resp[budget.currency] = +amount);
    });
    return resp;
  }
}

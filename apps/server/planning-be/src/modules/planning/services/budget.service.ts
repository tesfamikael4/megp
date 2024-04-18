import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
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
      const appBudgets = await this.repositoryBudget.find({
        where: { appId: data.appId },
      });

      const app = await this.repositoryApp.findOneBy({
        id: data.appId,
      });
      const items = data.budgets.map((budget) => {
        const prevBudget = appBudgets.find(
          (bud) => bud.budgetCode == budget.budgetCode,
        );

        if (prevBudget) {
          budget.availableBudget =
            +budget.revisedBudget - +prevBudget.obligatedBudget;

          this.checkBudgetValidity(budget, prevBudget);
        }

        return {
          ...budget,
          appId: data.appId,
          budgetYearId: app.budgetYearId,
          organizationId: app.organizationId,
        };
      });

      const result = await this.repositoryBudget.create(items);
      await entityManager.getRepository(Budget).upsert(result, {
        conflictPaths: ['budgetCode'],
      });
      return result;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getSummation(organizationId: string, appId: string) {
    const budgets = await this.repositoryBudget.find({
      where: { organizationId, appId },
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

  private checkBudgetValidity(budget: any, prevBudget: any) {
    if (budget.revisedBudget < +prevBudget.obligatedBudget) {
      throw new HttpException(
        'can not update budget with revised budget less than obligated budget',
        430,
      );
    }

    if (budget.availableBudget > budget.revisedBudget)
      throw new HttpException(
        `available budget of budget ${budget.budgetCode} is less than the revised budget`,
        430,
      );

    if (budget.availableBudget < 0)
      throw new HttpException(
        `available budget of budget ${budget.budgetCode} is less than zero`,
        430,
      );

    if (budget.revisedBudget < 0)
      throw new HttpException(
        `revised budget of budget ${budget.budgetCode} is less than zero`,
        430,
      );

    if (budget.allocatedBudget < 0)
      throw new HttpException(
        `allocated budget of budget ${budget.budgetCode} is less than zero`,
        430,
      );

    return budget;
  }
}

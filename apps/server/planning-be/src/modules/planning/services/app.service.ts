import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import {
  LessThan,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { APP, BudgetYear, PreBudgetPlan } from 'src/entities';
import { EntityCrudService } from 'src/shared/service';
import { Http2ServerRequest } from 'http2';

@Injectable()
export class APPService extends EntityCrudService<APP> {
  constructor(
    @InjectRepository(APP)
    private readonly repositoryAPP: Repository<APP>,
    @InjectRepository(PreBudgetPlan)
    private readonly repositoryPreBudgetPlan: Repository<PreBudgetPlan>,
    @InjectRepository(BudgetYear)
    private readonly repositoryBudgetYear: Repository<BudgetYear>,
  ) {
    super(repositoryAPP);
  }

  async autoCreate(input: any): Promise<APP> {
    const item = new APP();

    let year = new Date();
    if (input.type == 'next') {
      year = new Date(year.setFullYear(year.getFullYear() + 1));
    }

    const budgetYear = await this.repositoryBudgetYear.findOne({
      where: {
        startDate: MoreThanOrEqual(year),
        endDate: LessThanOrEqual(year),
      },
    });

    const app = await this.repositoryAPP.findOne({
      where: {
        budgetYear: budgetYear.name,
        organizationId: input.organizationId,
      },
    });
    if (app) {
      throw new HttpException('App already exist', 430);
    }

    item.planName = 'Annual Procurement Plan ' + budgetYear.name;
    item.organizationId = input.organizationId;
    const preBud = new PreBudgetPlan();

    preBud.estimatedAmount = {};
    item.preBudgetPlans = preBud;
    item.preBudgetPlans.organizationId = input.organizationId;
    const createApp = {
      ...item,
      budgetYearId: budgetYear.id,
      budgetYear: budgetYear.name,
      organizationId: input.organizationId,
    };

    await this.repositoryAPP.save(createApp);
    return item;
  }
}

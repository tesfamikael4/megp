import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { APP, BudgetYear, PreBudgetPlan } from 'src/entities';
import { EntityCrudService } from 'src/shared/service';

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

    const year = new Date().getFullYear();

    let budYear = '';
    if (input.type == 'next') {
      budYear = String(year + 1);
    } else if (input.type == 'current') {
      budYear = String(year);
    } else {
      throw new BadRequestException('invalid_type');
    }

    const budgetYear = await this.repositoryBudgetYear.findOne({
      where: {
        name: budYear,
        organizationId: input.organizationId,
      },
    });

    const app = await this.repositoryAPP.findOne({
      where: {
        budgetYear: budYear,
        organizationId: input.organizationId,
      },
    });
    if (app) {
      throw new BadRequestException('app_exist');
    }

    item.planName = 'Annual Procurement Plan ' + budYear;
    item.organizationId = input.organizationId;
    const preBud = new PreBudgetPlan();

    preBud.estimatedAmount = {};
    item.preBudgetPlans = preBud;
    item.preBudgetPlans.organizationId = input.organizationId;
    const createApp = {
      ...item,
      budgetYearId: budgetYear.id,
      budgetYear: budYear,
      organizationId: input.organizationId,
    };

    await this.repositoryAPP.save(createApp);
    return item;
  }
}

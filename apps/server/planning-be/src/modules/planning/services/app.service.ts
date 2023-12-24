import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { LessThan, MoreThan, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { APP, BudgetYear, PreBudgetPlan } from 'src/entities';
import { EntityCrudService } from 'src/shared/service';
import { CreateAPPAuto, CreateAPPDto } from '../dtos/app.dto';

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
    } else {
      throw new BadRequestException('invalid_type');
    }

    // const budgetYear = await this.repositoryBudgetYear.findOne({
    //   where: {
    //     startDate: MoreThanOrEqual(year),
    //     endDate: LessThan(year),
    //   }
    // })

    const budgetYear = await this.repositoryBudgetYear.findOne({
      where: {
        name: budYear,
      },
    });

    const app = await this.repositoryAPP.findOne({
      where: { budgetYear: item.budgetYear },
    });
    if (app) {
      throw new BadRequestException('app_exist');
    }

    item.planName = 'Annual Procurement Plan ' + budYear;
    const preBud = new PreBudgetPlan();

    preBud.estimatedAmount = {};
    item.preBudgetPlans = preBud;
    const createApp = {
      ...item,
      budgetYearId: budgetYear.id,
      budgetYear: budYear,
    };

    await this.repositoryAPP.save(createApp);
    return item;
  }
}

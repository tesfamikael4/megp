import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { APP, PreBudgetPlan } from 'src/entities';
import { EntityCrudService } from 'src/shared/service';
import { CreateAPPAuto, CreateAPPDto } from '../dtos/app.dto';

@Injectable()
export class APPService extends EntityCrudService<APP> {
  constructor(
    @InjectRepository(APP)
    private readonly repositoryAPP: Repository<APP>,
    @InjectRepository(PreBudgetPlan)
    private readonly repositoryPreBudgetPlan: Repository<PreBudgetPlan>,
  ) {
    super(repositoryAPP);
  }

  async autoCreate(input: any): Promise<APP> {
    const item = new APP();

    const year = new Date().getFullYear();
    if (input.type == 'current') {
      item.budgetYear = String(year);
    } else if (input.type == 'next') {
      item.budgetYear = String(year + 1);
    } else {
      throw new BadRequestException('invalid_type');
    }

    const app = await this.repositoryAPP.findOne({
      where: { budgetYear: item.budgetYear },
    });
    if (app) {
      throw new BadRequestException('app_exist');
    }

    item.planName = 'Annual Procurement Plan ' + item.budgetYear;
    const preBud = new PreBudgetPlan();
    preBud.currency = '';
    preBud.totalEstimatedAmount = 0;
    item.preBudgetPlans = preBud;

    await this.repositoryAPP.save(item);
    return item;
  }
}

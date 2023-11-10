import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { APP, PreBudgetPlan } from 'src/entities';
import { EntityCrudService } from 'src/shared/service';
import { CreateAPPDto } from '../dtos/app.dto';

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

  async create(itemData: CreateAPPDto): Promise<APP> {
    const item = this.repositoryAPP.create(itemData);
    await this.repositoryAPP.save(item);

    const preBud = new PreBudgetPlan();
    preBud.currency = '';
    preBud.totalEstimatedAmount = 0;
    preBud.appId = item.id;

    await this.repositoryPreBudgetPlan.save(preBud);

    return item;
  }
}

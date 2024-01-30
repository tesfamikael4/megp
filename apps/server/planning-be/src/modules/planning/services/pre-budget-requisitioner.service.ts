import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { PreBudgetRequisitioner } from 'src/entities/pre-budget-plan-requisitioner.entity';

@Injectable()
export class PreBudgetRequisitionerService extends ExtraCrudService<PreBudgetRequisitioner> {
  constructor(
    @InjectRepository(PreBudgetRequisitioner)
    private readonly repositoryPreBudgetRequisitioner: Repository<PreBudgetRequisitioner>,
  ) {
    super(repositoryPreBudgetRequisitioner);
  }

  async bulkCreate(requisitioner: any, req: any): Promise<any> {
    if (req?.user?.organization) {
      requisitioner.requisitioner.map((item) => {
        item.organizationId = req.user.organization.id;
      });
    }
    await this.repositoryPreBudgetRequisitioner.delete({
      preBudgetPlanActivityId:
        requisitioner?.requisitioner[0].preBudgetPlanActivityId,
    });

    const requisitioners = await this.repositoryPreBudgetRequisitioner.create(
      requisitioner.requisitioner as any,
    );
    await this.repositoryPreBudgetRequisitioner.insert(requisitioners);

    return requisitioner;
  }
}

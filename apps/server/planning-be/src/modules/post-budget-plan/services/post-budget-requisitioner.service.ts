import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { PostBudgetRequisitioner } from 'src/entities/post-budget-plan-requisitioner.entity';

@Injectable()
export class PostBudgetRequisitionerService extends ExtraCrudService<PostBudgetRequisitioner> {
  constructor(
    @InjectRepository(PostBudgetRequisitioner)
    private readonly repositoryPostBudgetRequisitioner: Repository<PostBudgetRequisitioner>,
  ) {
    super(repositoryPostBudgetRequisitioner);
  }

  async bulkCreate(requisitioner: any, organization: any): Promise<any> {
    requisitioner.requisitioner.map((item) => {
      item.organizationId = organization.id;
      item.organizationName = organization.name;
    });
    await this.repositoryPostBudgetRequisitioner.delete({
      postBudgetPlanActivityId:
        requisitioner?.requisitioner[0].postBudgetPlanActivityId,
    });

    const requisitioners = await this.repositoryPostBudgetRequisitioner.create(
      requisitioner.requisitioner as any,
    );
    await this.repositoryPostBudgetRequisitioner.insert(requisitioners);

    return requisitioner;
  }
}

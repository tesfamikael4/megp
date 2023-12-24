import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { PostBudgetPlan, PostBudgetPlanDisbursement } from 'src/entities';

@Injectable()
export class PostBudgetPlanDisbursementService extends ExtraCrudService<PostBudgetPlanDisbursement> {
  constructor(
    @InjectRepository(PostBudgetPlanDisbursement)
    private readonly repositoryPostBudgetPlanDisbursement: Repository<PostBudgetPlanDisbursement>,
    @InjectRepository(PostBudgetPlan)
    private readonly repositoryPostBudgetPlan: Repository<PostBudgetPlan>,
  ) {
    super(repositoryPostBudgetPlanDisbursement);
  }

  async bulkCreate(data: any): Promise<PostBudgetPlanDisbursement[]> {
    try {
      const disbursement = await this.repositoryPostBudgetPlanDisbursement.find(
        {
          where: { postBudgetPlanActivityId: data[0].postBudgetPlanActivityId },
        },
      );
      if (disbursement.length > 0) {
        await this.repositoryPostBudgetPlanDisbursement.delete(
          disbursement as any,
        );
      }
      // const item = {
      //   ...data,
      //   postBudgetPlanActivityId: data.postBudgetPlanActivityId
      // }
      // const plan = this.repositoryPostBudgetPlan.findPostBudgetPlans()
      await this.repositoryPostBudgetPlanDisbursement.create(data);
      return await this.repositoryPostBudgetPlanDisbursement.save(data);
    } catch (err) {
      console.log(err);
    }
  }
}

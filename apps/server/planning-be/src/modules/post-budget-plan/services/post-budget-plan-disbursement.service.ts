import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import {
  PostBudgetPlan,
  PostBudgetPlanActivity,
  PostBudgetPlanDisbursement,
} from 'src/entities';

@Injectable()
export class PostBudgetPlanDisbursementService extends ExtraCrudService<PostBudgetPlanDisbursement> {
  constructor(
    @InjectRepository(PostBudgetPlanDisbursement)
    private readonly repositoryPostBudgetPlanDisbursement: Repository<PostBudgetPlanDisbursement>,
    @InjectRepository(PostBudgetPlanActivity)
    private readonly repositoryPostBudgetPlanActivity: Repository<PostBudgetPlanActivity>,
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
      const act = await this.repositoryPostBudgetPlanActivity.findOneBy({
        id: data[0].postBudgetPlanActivityId,
      });
      const totalAmount = data.reduce((acc, item) => acc + item.amount, 0);

      if (act.estimatedAmount < totalAmount) {
        throw new HttpException(
          'Disbursement amount is greater than budget amount',
          400,
        );
      }

      await this.repositoryPostBudgetPlanDisbursement.create(data);
      return await this.repositoryPostBudgetPlanDisbursement.save(data);
    } catch (err) {
      console.log(err);
    }
  }
}

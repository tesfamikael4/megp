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
          where: {
            postBudgetPlanActivityId: data.postBudgetPlanActivityId,
            organizationId: data.organizationId,
          },
        },
      );
      if (disbursement.length > 0) {
        await this.repositoryPostBudgetPlanDisbursement.delete(
          disbursement as any,
        );
      }

      const act = await this.repositoryPostBudgetPlanActivity.findOneBy({
        id: data.postBudgetPlanActivityId,
        organizationId: data.organizationId,
        organizationName: data.organizationName,
      });
      const totalAmount = data.data.reduce((acc, item) => acc + item.amount, 0);

      if (+act.estimatedAmount < totalAmount) {
        throw new HttpException(
          'Disbursement amount is greater than estimated amount',
          430,
        );
      }

      data.data.forEach((item) => {
        item.postBudgetPlanActivityId = data.postBudgetPlanActivityId;
        item.organizationId = data.organizationId;
      });

      await this.repositoryPostBudgetPlanDisbursement.create(data.data);
      return await this.repositoryPostBudgetPlanDisbursement.save(data.data);
    } catch (err) {
      console.log(err);
    }
  }
}

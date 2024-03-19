import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service';
import { Reason } from 'src/entities/reason.entity';

@Injectable()
export class ReasonService extends EntityCrudService<Reason> {
  constructor(
    @InjectRepository(Reason)
    private readonly repositoryReason: Repository<Reason>,
  ) {
    super(repositoryReason);
  }

  async create(itemData: any, req?: any): Promise<any> {
    if (req?.user?.organization) {
      itemData.organizationId = req.user.organization.id;
    }

    const [budgetPlanActivityId, type] = itemData.preBudgetPlanActivityId
      ? [itemData.preBudgetPlanActivityId, 'preBudgetPlanActivityId']
      : [itemData.postBudgetPlanActivityId, 'postBudgetPlanActivityId'];

    const reason = await this.repositoryReason.find({
      where: {
        [type]: budgetPlanActivityId,
        type: itemData.type,
      },
    });
    if (reason.length > 0) {
      await this.repositoryReason.remove(reason as any);
    }

    const item = this.repositoryReason.create(itemData);
    await this.repositoryReason.insert(item);
    return item;
  }

  // remove previous justification reason when they became valid
  async isValid(
    activityId: string,
    key: string,
    status: string,
    planType: 'pre' | 'post',
  ) {
    try {
      if (status === 'fail') {
        const countQuery = {
          where: {
            [`${planType}BudgetPlanActivityId`]: activityId,
            type: key,
          },
        };

        const count = await this.repositoryReason.count(countQuery);

        if (count === 0) {
          throw new HttpException(`Please enter justification for ${key}`, 430);
        }
      } else {
        await this.repositoryReason.softDelete({
          objectId: activityId,
          type: key,
        });
        return true;
      }
    } catch (error) {
      throw error;
    }
  }
}

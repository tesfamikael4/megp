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

    const reason = await this.repositoryReason.find({
      where: {
        objectId: itemData.objectId,
        type: itemData.type,
      },
    });
    if (reason.length > 0) {
      await this.repositoryReason.delete(reason as any);
    }

    const item = this.repositoryReason.create(itemData);
    await this.repositoryReason.insert(item);
    return item;
  }

  // remove previous justification reason when they became valid
  async isValid(preBudgetPlanActivityId: string, key: string, status: string) {
    try {
      if (status == 'fail') {
        const count = await this.repositoryReason.count({
          where: {
            objectId: preBudgetPlanActivityId,
            type: key,
          },
        });
        if (count == 0) {
          throw new HttpException(`Please enter justification for ${key}`, 430);
        }
      } else {
        await this.repositoryReason.softDelete({
          objectId: preBudgetPlanActivityId,
          type: key,
        });
        return true;
      }
    } catch (error) {
      throw error;
    }
  }
}

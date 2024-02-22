import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ExtraCrudService } from 'megp-shared-be';
import { Step } from '../../../entities';
import { DefaultStep } from 'src/entities/default-step.entity';
import { Instance } from 'src/entities/instance.entity';
import { InstanceStep } from 'src/entities/instance-step.entity';
import { Activity } from 'src/entities/activity.entity';

@Injectable()
export class InstanceStepService extends ExtraCrudService<InstanceStep> {
  constructor(
    @InjectRepository(InstanceStep)
    private readonly repositoryInstanceStep: Repository<InstanceStep>,
    @InjectRepository(DefaultStep)
    private readonly repositoryDefaultStep: Repository<DefaultStep>,
    @InjectRepository(Activity)
    private readonly repositoryActivity: Repository<Activity>,
  ) {
    super(repositoryInstanceStep);
  }

  async bulkCreate(steps: InstanceStep[]): Promise<InstanceStep[]> {
    const organizationId = steps[0].organizationId;
    const preStep = await this.repositoryInstanceStep.find({
      where: {
        activityId: steps[0].activityId,
        organizationId: organizationId,
      },
    });
    if (preStep.length > 0) {
      await this.repositoryInstanceStep.delete(preStep as any);
    }

    const items = this.repositoryInstanceStep.create(steps);
    await this.repositoryInstanceStep.insert(items);

    return items;
  }

  private checkOrder(defaultStep: any, steps: any): boolean {
    const orderList = [];

    for (const element of defaultStep) {
      const name = element.name;
      const matchingStep = steps.find((step) => step.name === name);

      if (matchingStep) {
        orderList.push(matchingStep);
      }
    }

    for (let i = 1; i < orderList.length; i++) {
      const currentStep = orderList[i];
      const previousStep = orderList[i - 1];

      if (currentStep.order <= previousStep.order) {
        return false;
      }
    }

    return true;
  }

  async orderStep(
    itemId: string,
    key: string,
    organizationId: string,
  ): Promise<any> {
    const activity = await this.repositoryActivity.findOne({
      where: {
        name: key,
      },
    });
    const [items, total] = await this.repositoryInstanceStep.findAndCount({
      where: { itemId, organizationId, activityId: activity.id },
      order: { order: 'ASC' },
    });
    return { items, total };
  }
}

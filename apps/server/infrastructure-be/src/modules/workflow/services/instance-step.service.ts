import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { ENTITY_MANAGER_KEY, ExtraCrudService } from 'megp-shared-be';
import { Step } from '../../../entities';
import { DefaultStep } from 'src/entities/default-step.entity';
import { Instance } from 'src/entities/instance.entity';
import { InstanceStep } from 'src/entities/instance-step.entity';
import { Activity } from 'src/entities/activity.entity';
import { REQUEST } from '@nestjs/core';

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

  async bulkCreate(
    steps: any,
    entityManager: EntityManager,
  ): Promise<InstanceStep[]> {
    try {
      const organizationId = steps[0].organizationId;
      const preStep = await entityManager.getRepository(InstanceStep).find({
        where: {
          activityId: steps[0].activityId,
          organizationId: organizationId,
          itemId: steps[0].itemId,
        },
      });
      if (preStep.length > 0) {
        await entityManager
          .getRepository(InstanceStep)
          .delete({ itemId: preStep[0].itemId });
      }
      const instanceStep = steps.map((step) => {
        return { ...step, id: undefined };
      });

      const items = this.repositoryInstanceStep.create(instanceStep);
      await entityManager.getRepository(InstanceStep).insert(items);
      return items;
    } catch (error) {
      throw error;
    }
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

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ExtraCrudService } from 'megp-shared-be';
import { Step } from '../../../entities';
import { DefaultStep } from 'src/entities/default-step.entity';
import { Instance } from 'src/entities/instance.entity';
import { InstanceStep } from 'src/entities/instance-step.entity';

@Injectable()
export class InstanceStepService extends ExtraCrudService<InstanceStep> {
  constructor(
    @InjectRepository(InstanceStep)
    private readonly repositoryInstanceStep: Repository<InstanceStep>,
    @InjectRepository(DefaultStep)
    private readonly repositoryDefaultStep: Repository<DefaultStep>,
  ) {
    super(repositoryInstanceStep);
  }

  async bulkCreate(steps: InstanceStep[], req: any): Promise<InstanceStep[]> {
    const organizationId = req?.user?.organization?.id;
    if (steps.some((obj) => obj.type === 'mandatory')) {
      const defaultSteps = await this.repositoryDefaultStep.find({
        where: {
          activityId: steps[0].activityId,
        },
        order: { order: 'ASC' },
      });

      const isCorrect = this.checkOrder(defaultSteps, steps);
      if (!isCorrect) {
        throw new Error('DefaultOrderIsMandatory');
      }
    }
    const preStep = await this.repositoryInstanceStep.find({
      where: {
        activityId: steps[0].activityId,
        organizationId: organizationId,
      },
    });
    if (preStep.length > 0) {
      await this.repositoryInstanceStep.delete(preStep as any);
    }
    steps.forEach((step) => {
      step.organizationId = organizationId;
      step.name = step.title.split(' ').join('');
    });
    const items = this.repositoryInstanceStep.create(steps);
    await this.repositoryInstanceStep.save(items);

    return steps;
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

  async orderStep(activityId: string, organizationId: string): Promise<any> {
    const [items, total] = await this.repositoryInstanceStep.findAndCount({
      where: { activityId: activityId, organizationId: organizationId },
      order: { order: 'ASC' },
    });
    return { items, total };
  }
}

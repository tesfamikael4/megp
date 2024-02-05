import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ExtraCrudService } from '@megp/shared-be';
import { Step } from '../../../entities';
import { DefaultStep } from 'src/entities/default-step.entity';

@Injectable()
export class StepService extends ExtraCrudService<Step> {
  constructor(
    @InjectRepository(Step)
    private readonly repositoryStep: Repository<Step>,
    @InjectRepository(DefaultStep)
    private readonly repositoryDefaultStep: Repository<DefaultStep>,
  ) {
    super(repositoryStep);
  }

  async bulkCreate(steps: Step[], req: any): Promise<Step[]> {
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
    const preStep = await this.repositoryStep.find({
      where: {
        activityId: steps[0].activityId,
        organizationId: organizationId,
      },
    });
    if (preStep.length > 0) {
      await this.repositoryStep.delete(preStep as any);
    }
    steps.forEach((step) => {
      step.organizationId = organizationId;
      step.name = step.title.split(' ').join('');
    });
    const items = this.repositoryStep.create(steps);
    await this.repositoryStep.save(items);

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
    const [items, total] = await this.repositoryStep.findAndCount({
      where: { activityId: activityId, organizationId: organizationId },
      order: { order: 'ASC' },
    });
    return { items, total };
  }
}

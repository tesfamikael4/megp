import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ExtraCrudService } from '../../../shared/service';
import { Step } from '../../../entities';

@Injectable()
export class StepService extends ExtraCrudService<Step> {
  constructor(
    @InjectRepository(Step)
    private readonly repositoryStep: Repository<Step>,
  ) {
    super(repositoryStep);
  }
  async bulkCreate(steps: Step[]): Promise<Step[]> {
    const budget = await this.repositoryStep.find({
      where: { activityId: steps[0].activityId },
    });
    if (budget.length > 0) {
      await this.repositoryStep.delete(budget as any);
    }
    const items = this.repositoryStep.create(steps);
    await this.repositoryStep.save(items);

    return steps;
  }
}

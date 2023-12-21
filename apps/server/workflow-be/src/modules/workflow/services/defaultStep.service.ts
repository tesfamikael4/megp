import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ExtraCrudService } from '../../../shared/service';
import { DefaultStep } from 'src/entities/defaultStep.entity';

@Injectable()
export class DefaultStepService extends ExtraCrudService<DefaultStep> {
  constructor(
    @InjectRepository(DefaultStep)
    private readonly repositoryDefaultStep: Repository<DefaultStep>,
  ) {
    super(repositoryDefaultStep);
  }

  async bulkCreate(defaultSteps: DefaultStep[]): Promise<DefaultStep[]> {
    const preStep = await this.repositoryDefaultStep.find({
      where: { activityId: defaultSteps[0].activityId },
    });
    if (preStep.length > 0) {
      await this.repositoryDefaultStep.delete(preStep as any);
    }
    const items = this.repositoryDefaultStep.create(defaultSteps);
    await this.repositoryDefaultStep.save(items);

    return defaultSteps;
  }
}

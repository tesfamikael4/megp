import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DefaultStep } from 'src/entities/default-step.entity';
import { ExtraCrudService } from 'megp-shared-be';

@Injectable()
export class DefaultStepService extends ExtraCrudService<DefaultStep> {
  constructor(
    @InjectRepository(DefaultStep)
    private readonly repositoryDefaultStep: Repository<DefaultStep>,
  ) {
    super(repositoryDefaultStep);
  }

  async bulkCreate(
    defaultSteps: DefaultStep[],
    organizationId: string,
  ): Promise<DefaultStep[]> {
    const preStep = await this.repositoryDefaultStep.find({
      where: {
        activityId: defaultSteps[0].activityId,
        organizationId: organizationId,
      },
    });
    if (preStep.length > 0) {
      await this.repositoryDefaultStep.delete(preStep as any);
    }
    defaultSteps.forEach((obj) => {
      obj.organizationId = organizationId;
      obj.name = obj.title.split(' ').join('');
    });
    const items = this.repositoryDefaultStep.create(defaultSteps);
    await this.repositoryDefaultStep.save(items);

    return defaultSteps;
  }

  async order(id, organizationId): Promise<any> {
    const [items, total] = await this.repositoryDefaultStep.findAndCount({
      where: { activityId: id },
      order: { order: 'ASC' },
    });
    return { items, total };
  }

  async orderAdmin(id, organizationId): Promise<any> {
    const [items, total] = await this.repositoryDefaultStep.findAndCount({
      where: { activityId: id, organizationId: organizationId },
      order: { order: 'ASC' },
    });
    return { items, total };
  }
}

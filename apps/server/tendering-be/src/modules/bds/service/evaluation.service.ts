import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BdsEvaluation } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class BdsEvaluationService extends ExtraCrudService<BdsEvaluation> {
  constructor(
    @InjectRepository(BdsEvaluation)
    private readonly bdsEvaluationRepository: Repository<BdsEvaluation>,
  ) {
    super(bdsEvaluationRepository);
  }

  async create(itemData: any, req?: any): Promise<any> {
    if (req?.user?.organization) {
      itemData.organizationId = req.user.organization.id;
      itemData.organizationName = req.user.organization.name;
    }
    const item = this.bdsEvaluationRepository.create(itemData);
    await this.bdsEvaluationRepository.upsert(item, ['tenderId']);
    return item;
  }

  async findOne(
    tenderId: string,
    req?: any,
  ): Promise<BdsEvaluation | undefined> {
    return await this.bdsEvaluationRepository.findOneBy({ tenderId });
  }

  async update(id: string, itemData: any) {
    const item = await this.bdsEvaluationRepository.findOneBy({ tenderId: id });
    await this.bdsEvaluationRepository.update(item.id, itemData);
    return {
      ...item,
      ...itemData,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RuleHandler } from 'src/entities';
import { EntityCrudService } from 'megp-shared-be';
import { Repository } from 'typeorm';

@Injectable()
export class RuleHandlerService extends EntityCrudService<RuleHandler> {
  constructor(
    @InjectRepository(RuleHandler)
    private readonly repositoryRuleHandler: Repository<RuleHandler>,
  ) {
    super(repositoryRuleHandler);
  }

  async findAllWithRelation() {
    return await this.repositoryRuleHandler.find({ relations: ['options'] });
  }
}

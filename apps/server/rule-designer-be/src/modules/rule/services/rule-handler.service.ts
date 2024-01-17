import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EnforcementMethodEnum,
  Rule,
  RuleDesigner,
  RuleHandler,
} from 'src/entities';
import { EntityCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';
import { compareCondition } from './check-conditions.js';
import { CollectionQuery } from 'src/shared/collection-query/query.js';

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

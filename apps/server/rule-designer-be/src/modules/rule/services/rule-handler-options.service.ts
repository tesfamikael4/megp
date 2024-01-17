import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RuleHandlerOptions } from 'src/entities';
import { EntityCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class RuleHandlerOptionsService extends EntityCrudService<RuleHandlerOptions> {
  constructor(
    @InjectRepository(RuleHandlerOptions)
    private readonly repositoryRuleHandlerOptions: Repository<RuleHandlerOptions>,
  ) {
    super(repositoryRuleHandlerOptions);
  }
}

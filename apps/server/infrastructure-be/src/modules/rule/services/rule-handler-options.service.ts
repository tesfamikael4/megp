import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RuleHandlerOptions } from 'src/entities';
import { ExtraCrudService } from 'megp-shared-be';
import { Repository } from 'typeorm';

@Injectable()
export class RuleHandlerOptionsService extends ExtraCrudService<RuleHandlerOptions> {
  constructor(
    @InjectRepository(RuleHandlerOptions)
    private readonly repositoryRuleHandlerOptions: Repository<RuleHandlerOptions>,
  ) {
    super(repositoryRuleHandlerOptions);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PossibleReasons, RuleHandlerOptions } from 'src/entities';
import { EntityCrudService, ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class PossibleReasonsService extends ExtraCrudService<PossibleReasons> {
  constructor(
    @InjectRepository(PossibleReasons)
    private readonly repositoryRuleHandlerOptions: Repository<PossibleReasons>,
  ) {
    super(repositoryRuleHandlerOptions);
  }
}

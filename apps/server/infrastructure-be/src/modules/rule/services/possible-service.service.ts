import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PossibleReasons } from 'src/entities';
import { ExtraCrudService } from 'megp-shared-be';
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

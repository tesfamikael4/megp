import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Formula } from 'src/entities/formula.entity';
import { ExtraCrudService } from 'src/shared/service';

@Injectable()
export class FormulaService extends ExtraCrudService<Formula> {
  constructor(
    @InjectRepository(Formula)
    private readonly formulaRepository: Repository<Formula>,
  ) {
    super(formulaRepository);
  }
}

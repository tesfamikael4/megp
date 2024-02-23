import { InjectRepository } from '@nestjs/typeorm';
import { SorIncidentalCost } from 'src/entities/sor-incidental-cost.entity';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

export class SorIncidentalCostService extends ExtraCrudService<SorIncidentalCost> {
  constructor(
    @InjectRepository(SorIncidentalCost)
    private readonly sorIncidentalCostsRepository: Repository<SorIncidentalCost>,
  ) {
    super(sorIncidentalCostsRepository);
  }
}

import { InjectRepository } from '@nestjs/typeorm';
import { SorFee } from 'src/entities/sor-fee.entity';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

export class SorFeeService extends ExtraCrudService<SorFee> {
  constructor(
    @InjectRepository(SorFee)
    private readonly sorFeeRepository: Repository<SorFee>,
  ) {
    super(sorFeeRepository);
  }
}

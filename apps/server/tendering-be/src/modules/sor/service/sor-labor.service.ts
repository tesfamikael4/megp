import { InjectRepository } from '@nestjs/typeorm';
import { SorLabor } from 'src/entities/sor-labor.entity';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

export class SorLaborService extends ExtraCrudService<SorLabor> {
  constructor(
    @InjectRepository(SorLabor)
    private readonly sorLaborRepository: Repository<SorLabor>,
  ) {
    super(sorLaborRepository);
  }
}

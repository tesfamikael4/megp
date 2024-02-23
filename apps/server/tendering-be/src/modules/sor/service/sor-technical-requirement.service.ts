import { InjectRepository } from '@nestjs/typeorm';
import { SorTechnicalRequirement } from 'src/entities/sor-technical-requirement.entity';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

export class SorTechnicalRequirementService extends ExtraCrudService<SorTechnicalRequirement> {
  constructor(
    @InjectRepository(SorTechnicalRequirement)
    private readonly sorTechnicalRequirementRepository: Repository<SorTechnicalRequirement>,
  ) {
    super(sorTechnicalRequirementRepository);
  }
}

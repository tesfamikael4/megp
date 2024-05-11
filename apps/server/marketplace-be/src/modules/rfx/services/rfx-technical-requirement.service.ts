import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraCrudService } from 'megp-shared-be';
import { RfxTechnicalRequirement } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class RfxTechnicalRequirementService extends ExtraCrudService<RfxTechnicalRequirement> {
  constructor(
    @InjectRepository(RfxTechnicalRequirement)
    private readonly rfxTechnicalRequirementRepository: Repository<RfxTechnicalRequirement>,
  ) {
    super(rfxTechnicalRequirementRepository);
  }
}

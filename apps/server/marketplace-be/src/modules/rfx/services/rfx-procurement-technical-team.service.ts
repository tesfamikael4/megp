import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraCrudService } from 'megp-shared-be';
import { RfxProcurementTechnicalTeam } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class RfxProcurementTechnicalTeamService extends ExtraCrudService<RfxProcurementTechnicalTeam> {
  constructor(
    @InjectRepository(RfxProcurementTechnicalTeam)
    private readonly procurementTechnicalTeamRepository: Repository<RfxProcurementTechnicalTeam>,
  ) {
    super(procurementTechnicalTeamRepository);
  }
}

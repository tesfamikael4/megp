import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProcurementTechnicalTeam } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class ProcurementTechnicalTeamService extends ExtraCrudService<ProcurementTechnicalTeam> {
  constructor(
    @InjectRepository(ProcurementTechnicalTeam)
    private readonly ProcurementTechnicalTeamRepository: Repository<ProcurementTechnicalTeam>,
  ) {
    super(ProcurementTechnicalTeamRepository);
  }
}

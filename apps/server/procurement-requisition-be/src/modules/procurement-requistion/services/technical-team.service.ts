import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TechnicalTeam } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class TechnicalTeamService extends ExtraCrudService<TechnicalTeam> {
  constructor(
    @InjectRepository(TechnicalTeam)
    private readonly repositoryTechnicalTeam: Repository<TechnicalTeam>,
  ) {
    super(repositoryTechnicalTeam);
  }

  async create(officers: any): Promise<any> {
    await this.repositoryTechnicalTeam.delete({
      procurementRequisitionId: officers[0].procurementRequisitionId,
    });

    const newOfficers = this.repositoryTechnicalTeam.create(officers as any);
    await this.repositoryTechnicalTeam.insert(newOfficers);

    return officers;
  }
}

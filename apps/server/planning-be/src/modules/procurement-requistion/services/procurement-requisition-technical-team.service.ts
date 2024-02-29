import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProcurementRequisitionTechnicalTeam } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';
import { CreateProcurementRequisitionTechnicalTeamsDto } from '../dto/procurement-requisition-technical-team.dto';

@Injectable()
export class ProcurementRequisitionTechnicalTeamService extends ExtraCrudService<ProcurementRequisitionTechnicalTeam> {
  constructor(
    @InjectRepository(ProcurementRequisitionTechnicalTeam)
    private readonly repositoryProcurementRequisitionTechnicalTeam: Repository<ProcurementRequisitionTechnicalTeam>,
  ) {
    super(repositoryProcurementRequisitionTechnicalTeam);
  }

  async bulkCreate(
    technicalTeam: CreateProcurementRequisitionTechnicalTeamsDto,
    organizationId: string,
  ) {
    await this.repositoryProcurementRequisitionTechnicalTeam.delete({
      procurementRequisitionId: technicalTeam.procurementRequisitionId,
    });

    const newTechnicalTeam =
      this.repositoryProcurementRequisitionTechnicalTeam.create(
        technicalTeam.officers as any,
      );
    newTechnicalTeam.forEach((x) => (x.organizationId = organizationId));

    await this.repositoryProcurementRequisitionTechnicalTeam.insert(
      newTechnicalTeam,
    );
    return newTechnicalTeam;
  }
}

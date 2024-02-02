import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProcurementRequisitionOfficerAssignment } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class ProcurementRequisitionOfficerAssignmentService extends ExtraCrudService<ProcurementRequisitionOfficerAssignment> {
  constructor(
    @InjectRepository(ProcurementRequisitionOfficerAssignment)
    private readonly repositoryProcurementRequisitionOfficerAssignment: Repository<ProcurementRequisitionOfficerAssignment>,
  ) {
    super(repositoryProcurementRequisitionOfficerAssignment);
  }

  async create(officers: any): Promise<any> {
    await this.repositoryProcurementRequisitionOfficerAssignment.delete({
      procurementRequisitionId: officers[0].procurementRequisitionId,
    });

    const newOfficers =
      this.repositoryProcurementRequisitionOfficerAssignment.create(
        officers as any,
      );
    await this.repositoryProcurementRequisitionOfficerAssignment.insert(
      newOfficers,
    );

    return officers;
  }
}

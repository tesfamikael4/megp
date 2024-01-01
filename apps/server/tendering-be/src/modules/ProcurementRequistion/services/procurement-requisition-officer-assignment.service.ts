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
}

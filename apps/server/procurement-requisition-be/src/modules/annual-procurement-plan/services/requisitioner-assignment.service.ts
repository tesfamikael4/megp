import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequisitionerAssignment } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class RequisitionerAssignmentService extends ExtraCrudService<RequisitionerAssignment> {
  constructor(
    @InjectRepository(RequisitionerAssignment)
    private readonly repositoryRequisitionerAssignment: Repository<RequisitionerAssignment>,
  ) {
    super(repositoryRequisitionerAssignment);
  }
}

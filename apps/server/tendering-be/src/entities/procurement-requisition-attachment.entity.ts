import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';
import { ProcurementRequisition } from './procurement-requisition.entity';
@Entity({ name: 'procurement_requisition_attachments' })
export class ProcurementRequisitionAttachment extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  fileName: string;
  @Column()
  fileType: string;
  @Column()
  bucketName: string;
  @Column()
  originalName: string;
  @Column({ nullable: true })
  attachmentUrl: string;
  @Column()
  path: string;

  @Column({ type: 'uuid' })
  procurementRequisitionId: string;

  @ManyToOne(
    () => ProcurementRequisition,
    (procurementRequisition) =>
      procurementRequisition.procurementRequisitionAttachments,
  )
  @JoinColumn({ name: 'procurementRequisitionId' })
  public procurementRequisition: ProcurementRequisition;
}

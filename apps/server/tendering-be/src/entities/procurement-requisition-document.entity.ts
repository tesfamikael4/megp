import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';
import { ProcurementRequisition } from './procurement-requisition.entity';
@Entity({ name: 'procurement_requisition_documents' })
export class ProcurementRequisitionDocument extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true })
  fileName: string;
  @Column()
  fileType: string;
  @Column()
  bucketName: string;
  @Column()
  originalName: string;
  @Column({ nullable: true })
  documentUrl: string;
  @Column()
  path: string;

  @Column({ type: 'uuid' })
  procurementRequisitionId: string;

  @ManyToOne(
    () => ProcurementRequisition,
    (procurementRequisition) =>
      procurementRequisition.procurementRequisitionDocuments,
  )
  @JoinColumn({ name: 'procurementRequisitionId' })
  public procurementRequisition: ProcurementRequisition;
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { OrgAudit } from 'src/shared/entities/audit.entity';
import { ProcurementRequisition } from './procurement-requisition.entity';
@Entity({ name: 'documents' })
export class Document extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true })
  filename: string;
  @Column()
  contentType: string;
  @Column()
  bucketName: string;
  @Column()
  originalname: string;
  @Column()
  filepath: string;

  @Column({ type: 'uuid' })
  procurementRequisitionId: string;

  @ManyToOne(
    () => ProcurementRequisition,
    (procurementRequisition) => procurementRequisition.documents,
  )
  @JoinColumn({ name: 'procurementRequisitionId' })
  public procurementRequisition: ProcurementRequisition;
}

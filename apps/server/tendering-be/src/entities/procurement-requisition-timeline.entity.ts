import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';
import { ProcurementRequisition } from './procurement-requisition.entity';
@Entity({ name: 'procurement_requisition_timelines' })
export class ProcurementRequisitionTimeline extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb' })
  timeline: JSON;

  @Column({ type: 'integer', unsigned: true })
  order: number;

  @Column({ type: 'double precision', unsigned: true })
  noOfDays: number;

  @Column({ type: 'timestamp' })
  dueDate: Date;

  @Column({ type: 'uuid' })
  procurementRequisitionId: string;

  @OneToOne(
    () => ProcurementRequisition,
    (procurementRequisition) =>
      procurementRequisition.procurementRequisitionTimelines,
  )
  @JoinColumn({ name: 'procurementRequisitionId' })
  public procurementRequisition: ProcurementRequisition;
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Check,
  Unique,
} from 'typeorm';

import { OrgAudit } from 'src/shared/entities/audit.entity';
import { ProcurementRequisition } from './procurement-requisition.entity';
@Entity({ name: 'procurement_mechanism_timelines' })
@Check('"order" >= 0 AND "period" >= 0')
@Unique(['order', 'procurementRequisitionId', 'deletedAt'])
export class ProcurementRequisitionTimeline extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  timeline: string;

  @Column({ unsigned: true })
  order: number;

  @Column()
  dueDate: Date;

  @Column({ nullable: true })
  appDueDate: Date;

  @Column({ unsigned: true })
  period: number;

  @Column({ default: 'draft' })
  status: string;

  @Column({ type: 'uuid' })
  procurementRequisitionId: string;

  @ManyToOne(
    () => ProcurementRequisition,
    (procurementRequisition) =>
      procurementRequisition.procurementRequisitionTimelines,
  )
  @JoinColumn({ name: 'procurementRequisitionId' })
  public procurementRequisition: ProcurementRequisition;
}

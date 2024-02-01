import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';
import { ProcurementRequisition } from './procurement-requisition.entity';

@Entity({ name: 'procurement_requisition_activities' })
@Unique(['annualProcurementPlanActivityId', 'deletedAt'])
export class ProcurementRequisitionActivity extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  procurementRequisitionId: string;

  @Column({ type: 'uuid' })
  annualProcurementPlanActivityId: string;

  @Column({ type: 'jsonb', nullable: true })
  annualProcurementPlan: JSON;

  @ManyToOne(
    () => ProcurementRequisition,
    (procurementRequisition) =>
      procurementRequisition.procurementRequisitionActivities,
  )
  @JoinColumn({ name: 'procurementRequisitionId' })
  public procurementRequisition: ProcurementRequisition;
}

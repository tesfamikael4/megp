import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';
import { AnnualProcurementPlanActivity } from './annual-procurement-plan-activity.entity';
@Entity({ name: 'requisitioner_assignments' })
export class RequisitionerAssignment extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  annualProcurementPlanActivityId: string;

  @ManyToOne(
    () => AnnualProcurementPlanActivity,
    (annualProcurementPlanActivity) =>
      annualProcurementPlanActivity.requisitionerAssignments,
  )
  @JoinColumn({ name: 'annualProcurementPlanActivityId' })
  public annualProcurementPlanActivity: AnnualProcurementPlanActivity;
}

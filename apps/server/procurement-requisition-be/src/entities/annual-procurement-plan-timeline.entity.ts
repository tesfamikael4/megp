import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';
import { AnnualProcurementPlanActivity } from './annual-procurement-plan-activity.entity';

@Entity({ name: 'annual_procurement_plan_timelines' })
export class AnnualProcurementPlanTimeline extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  timeline: string;

  @Column({ type: 'integer', unsigned: true })
  order: number;

  @Column({ type: 'double precision', unsigned: true })
  noOfDays: number;

  @Column({ type: 'timestamp' })
  dueDate: Date;

  @Column({ type: 'uuid' })
  annualProcurementPlanActivityId: string;

  @ManyToOne(
    () => AnnualProcurementPlanActivity,
    (annualProcurementPlanActivity) =>
      annualProcurementPlanActivity.annualProcurementPlanTimelines,
  )
  @JoinColumn({ name: 'annualProcurementPlanActivityId' })
  public annualProcurementPlanActivity: AnnualProcurementPlanActivity;
}

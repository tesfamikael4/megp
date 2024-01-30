import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';
import { AnnualProcurementPlanActivity } from './annual-procurement-plan-activity.entity';
@Entity({ name: 'annual_procurement_plan_disbursements' })
export class AnnualProcurementPlanDisbursement extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quarter: string;

  @Column({ type: 'integer', unsigned: true })
  order: number;

  @Column({ type: 'double precision', default: 0.0 })
  amount: number;

  @Column()
  currency: string;

  @Column({ type: 'uuid' })
  annualProcurementPlanActivityId: string;

  @Column({ type: 'jsonb' })
  budgetYear: JSON;

  @ManyToOne(
    () => AnnualProcurementPlanActivity,
    (annualProcurementPlanActivity) =>
      annualProcurementPlanActivity.annualProcurementPlanDisbursements,
  )
  @JoinColumn({ name: 'annualProcurementPlanActivityId' })
  public annualProcurementPlanActivity: AnnualProcurementPlanActivity;
}

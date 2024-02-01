import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';
import { AnnualProcurementPlanActivity } from './annual-procurement-plan-activity.entity';

@Entity({ name: 'annual_procurement_plan_budget_lines' })
export class AnnualProcurementPlanBudgetLine extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  budgetCode: string;

  @Column({ type: 'double precision', default: 0.0 })
  fundingSource: number;

  @Column({ type: 'double precision', default: 0.0 })
  amount: number;

  @Column()
  budgetYear: string;

  @Column({ default: 'USD' })
  currency: string;

  @Column({ type: 'uuid' })
  annualProcurementPlanActivityId: string;

  @ManyToOne(
    () => AnnualProcurementPlanActivity,
    (annualProcurementPlanActivity) =>
      annualProcurementPlanActivity.annualProcurementPlanBudgetLines,
  )
  @JoinColumn({ name: 'annualProcurementPlanActivityId' })
  public annualProcurementPlanActivity: AnnualProcurementPlanActivity;
}

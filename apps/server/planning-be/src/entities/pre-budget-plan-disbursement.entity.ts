import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { PreBudgetPlanActivity } from './pre-budget-plan-activity.entity';

@Entity({ name: 'pre_budge_plan_disbursements' })
export class PreBudgetPlanDisbursement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  preBudgetPlanActivityId: string;

  @ManyToOne(
    () => PreBudgetPlanActivity,
    (preBudgetPlanActivity) => preBudgetPlanActivity.preBudgetPlanDisbursements,
  )
  @JoinColumn({ name: 'preBudgetPlanActivityId' })
  public preBudgetPlanActivity: PreBudgetPlanActivity;

  @Column()
  quarterName: string;

  @Column()
  description: string;

  @Column({ type: 'json' })
  metaData: JSON;

  @Column()
  amount: number;

  @Column()
  unitPrice: number;
}

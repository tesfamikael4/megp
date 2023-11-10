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

@Entity({ name: 'pre_budget_plan_framework_contracts' })
export class PreBudgetPlanFrameworkContract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  preBudgetPlanActivityId: string;

  @ManyToOne(
    () => PreBudgetPlanActivity,
    (preBudgetPlanActivity) =>
      preBudgetPlanActivity.preBudgetPlanFrameworkContracts,
  )
  @JoinColumn({ name: 'preBudgetPlanActivityId' })
  public preBudgetPlanActivity: PreBudgetPlanActivity;

  @Column()
  contractName: string;

  @Column()
  contractNumber: string;

  @Column()
  agreement: string;
}

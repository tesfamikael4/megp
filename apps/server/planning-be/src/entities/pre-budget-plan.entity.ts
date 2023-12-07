import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { APP } from './app.entity';
import { PreBudgetPlanActivity } from './pre-budget-plan-activity.entity';
import { PostBudgetPlan } from './post-budget-plan.entity';

@Entity({ name: 'pre_budget_plans' })
export class PreBudgetPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  appId: string;

  @OneToOne(() => APP, (app) => app.preBudgetPlans)
  @JoinColumn({ name: 'appId' })
  public app: APP;

  @OneToOne(
    () => PostBudgetPlan,
    (postBudgetPlans) => postBudgetPlans.preBudgetPlan,
    {
      cascade: true,
    },
  )
  postBudgetPlan: PostBudgetPlan;

  @OneToMany(
    () => PreBudgetPlanActivity,
    (preBudgetPlanActivities) => preBudgetPlanActivities.preBudgetPlan,
  )
  preBudgetPlanActivities: PreBudgetPlanActivity[];

  @Column()
  totalEstimatedAmount: number;

  @Column()
  currency: string;

  @Column({ default: 'Draft' })
  status: string;
}

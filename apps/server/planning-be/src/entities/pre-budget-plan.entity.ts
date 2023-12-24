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
import { OrgAudit } from 'src/shared/entities';

@Entity({ name: 'pre_budget_plans' })
export class PreBudgetPlan extends OrgAudit {
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

  @Column({ type: 'json' })
  estimatedAmount: any;

  @Column({ default: 'Draft' })
  status: string;
}

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
import { PostBudgetPlanActivity } from './post-budget-plan-activity.entity';
import { PreBudgetPlan } from './pre-budget-plan.entity';
import { OrgAudit } from 'src/shared/entities';

@Entity({ name: 'post_budget_plans' })
export class PostBudgetPlan extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  appId: string;

  @OneToOne(() => APP, (app) => app.preBudgetPlans)
  @JoinColumn({ name: 'appId' })
  public app: APP;

  @Column()
  preBudgetPlanId: string;

  @OneToOne(
    () => PreBudgetPlan,
    (preBudgetPlan) => preBudgetPlan.postBudgetPlan,
  )
  @JoinColumn({ name: 'preBudgetPlanId' })
  public preBudgetPlan: PreBudgetPlan;

  @OneToMany(
    () => PostBudgetPlanActivity,
    (postBudgetPlanActivities) => postBudgetPlanActivities.postBudgetPlan,
  )
  postBudgetPlanActivities: PostBudgetPlanActivity[];

  @Column({ type: 'json' })
  estimatedAmount: JSON;

  @Column()
  status: string;
}

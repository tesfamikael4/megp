import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';
import { PostBudgetPlan } from './post-budget-plan.entity';

@Entity({ name: 'post_budget_plan_activities' })
export class PostBudgetPlanActivity extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'uuid' })
  postBudgetPlanId: string;

  @ManyToOne(
    () => PostBudgetPlan,
    (postBudgetPlan) => postBudgetPlan.postBudgetPlanActivity,
  )
  @JoinColumn({ name: 'postBudgetPlanId' })
  public postBudgetPlan: PostBudgetPlan;
}

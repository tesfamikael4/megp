import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';
import { PostBudgetPlanActivity } from './post-budget-plan-activity.entity';
@Entity({ name: 'post_budget_plan' })
export class PostBudgetPlan extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @OneToMany(
    () => PostBudgetPlanActivity,
    (postBudgetPlanActivity) => postBudgetPlanActivity.postBudgetPlan,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  postBudgetPlanActivity: PostBudgetPlanActivity[];
}

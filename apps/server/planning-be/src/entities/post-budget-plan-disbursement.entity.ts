import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { PostBudgetPlanActivity } from './post-budget-plan-activity.entity';

@Entity({ name: 'post_budget_plan_disbursements' })
export class PostBudgetPlanDisbursement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  postBudgetPlanActivityId: string;

  @ManyToOne(
    () => PostBudgetPlanActivity,
    (postBudgetPlanActivity) =>
      postBudgetPlanActivity.postBudgePlantDisbursements,
  )
  @JoinColumn({ name: 'postBudgetPlanActivityId' })
  public postBudgetPlanActivity: PostBudgetPlanActivity;

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

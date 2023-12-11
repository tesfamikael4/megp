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

@Entity({ name: 'post_budget_plan_timelines' })
export class PostBudgetPlanTimeline {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  postBudgetPlanActivityId: string;

  @ManyToOne(
    () => PostBudgetPlanActivity,
    (postBudgetPlanActivity) => postBudgetPlanActivity.postBudgetPlanTimelines,
  )
  @JoinColumn({ name: 'postBudgetPlanActivityId' })
  public postBudgetPlanActivity: PostBudgetPlanActivity;

  @Column({ nullable: true })
  activityName: string;

  @Column()
  fromDate: Date;

  @Column()
  toDate: Date;

  @Column()
  operationMethod: string;

  @Column()
  period: number;

  @Column()
  order: number;

  @Column({ default: 'draft' })
  status: string;
}

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
  timeline: string;

  @Column()
  order: number;

  @Column()
  dueDate: Date;

  @Column()
  period: number;

  @Column({ default: 'draft' })
  status: string;
}

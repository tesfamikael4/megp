import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Check,
} from 'typeorm';

import { PostBudgetPlanActivity } from './post-budget-plan-activity.entity';
import { OrgAudit } from 'src/shared/entities';

@Entity({ name: 'post_budget_plan_timelines' })
@Check('"order" >= 0 AND "period" >= 0')
export class PostBudgetPlanTimeline extends OrgAudit {
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

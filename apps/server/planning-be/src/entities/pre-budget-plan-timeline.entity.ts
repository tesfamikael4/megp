import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Check,
  Unique,
} from 'typeorm';

import { PreBudgetPlanActivity } from './pre-budget-plan-activity.entity';
import { OrgAudit } from 'src/shared/entities';

@Entity({ name: 'pre_budget_plan_timelines' })
@Check('"order" >= 0 AND "period" >= 0')
@Unique(['order', 'preBudgetPlanActivityId'])
export class PreBudgetPlanTimeline extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  preBudgetPlanActivityId: string;

  @ManyToOne(
    () => PreBudgetPlanActivity,
    (preBudgetPlanActivity) => preBudgetPlanActivity.preBudgetPlanTimelines,
  )
  @JoinColumn({ name: 'preBudgetPlanActivityId' })
  public preBudgetPlanActivity: PreBudgetPlanActivity;

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

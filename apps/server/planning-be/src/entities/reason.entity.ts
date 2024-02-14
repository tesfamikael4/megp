import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { APP } from './app.entity';
import { PreBudgetPlanActivity } from './pre-budget-plan-activity.entity';
import { PostBudgetPlan } from './post-budget-plan.entity';
import { OrgAudit } from 'src/shared/entities';
import { PostBudgetPlanActivity } from './post-budget-plan-activity.entity';

@Entity({ name: 'reasons' })
export class Reason extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  preBudgetPlanActivityId: string;

  @ManyToOne(
    () => PreBudgetPlanActivity,
    (preBudgetPlanActivity) => preBudgetPlanActivity.reasons,
  )
  @JoinColumn({ name: 'preBudgetPlanActivityId' })
  public preBudgetPlanActivity: PreBudgetPlanActivity;

  @Column({ nullable: true })
  postBudgetPlanActivityId: string;

  @ManyToOne(
    () => PostBudgetPlanActivity,
    (postBudgetPlanActivity) => postBudgetPlanActivity.reasons,
  )
  @JoinColumn({ name: 'postBudgetPlanActivityId' })
  public postBudgetPlanActivity: PostBudgetPlanActivity;

  @Column({ type: 'uuid' })
  objectId: string;

  @Column()
  type: string;

  @Column({ type: 'text' })
  reason: string;

  @Column({ type: 'text' })
  remark: string;
}

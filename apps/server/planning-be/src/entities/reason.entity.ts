import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { APP } from './app.entity';
import { PreBudgetPlanActivity } from './pre-budget-plan-activity.entity';
import { PostBudgetPlan } from './post-budget-plan.entity';
import { OrgAudit } from 'src/shared/entities';

@Entity({ name: 'reasons' })
export class Reason extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  objectId: string;

  @Column({ type: 'uuid' })
  activityId: string;

  @Column()
  type: string;

  @Column({ type: 'text' })
  reason: string;

  @Column({ type: 'text' })
  remark: string;
}

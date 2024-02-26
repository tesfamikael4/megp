import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { PreBudgetPlanActivity } from './pre-budget-plan-activity.entity';
import { OrgAudit } from 'src/shared/entities';

@Entity({ name: 'pre_budget_activity_documents' })
export class PreBudgetActivityDocument extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  preBudgetPlanActivityId: string;

  @ManyToOne(
    () => PreBudgetPlanActivity,
    (preBudgetPlanActivity) => preBudgetPlanActivity.preBudgetActivityDocuments,
  )
  @JoinColumn({ name: 'preBudgetPlanActivityId' })
  public preBudgetPlanActivity: PreBudgetPlanActivity;

  @Column()
  title: string;

  @Column({ type: 'jsonb' })
  fileInfo: any;
}

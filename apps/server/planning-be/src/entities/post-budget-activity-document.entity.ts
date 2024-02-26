import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { PostBudgetPlanActivity } from './post-budget-plan-activity.entity';
import { OrgAudit } from 'src/shared/entities';

@Entity({ name: 'post_budget_activity_documents' })
export class PostBudgetActivityDocument extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  postBudgetPlanActivityId: string;

  @ManyToOne(
    () => PostBudgetPlanActivity,
    (postBudgetPlanActivity) =>
      postBudgetPlanActivity.postBudgetActivityDocuments,
  )
  @JoinColumn({ name: 'postBudgetPlanActivityId' })
  public postBudgetPlanActivity: PostBudgetPlanActivity;

  @Column()
  title: string;

  @Column({ type: 'jsonb' })
  fileInfo: any;
}

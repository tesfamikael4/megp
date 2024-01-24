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
import { BudgetYear } from './budget-year.entity';
import { OrgAudit } from 'src/shared/entities';

@Entity({ name: 'post_budget_plan_disbursements' })
@Check('"amount" >= 0 AND "order" >= 0')
export class PostBudgetPlanDisbursement extends OrgAudit {
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
  budgetYear: string;

  @Column()
  quarter: string;

  @Column()
  order: number;

  @Column()
  amount: number;

  @Column()
  currency: string;
}

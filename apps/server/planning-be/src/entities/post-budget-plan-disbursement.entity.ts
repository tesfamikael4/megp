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
@Check('"amount" >= 0')
export class PostBudgetPlanDisbursement extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  postBudgetPlanActivityId: string;

  @ManyToOne(
    () => PostBudgetPlanActivity,
    (postBudgetPlanActivity) =>
      postBudgetPlanActivity.postBudgePlanDisbursements,
  )
  @JoinColumn({ name: 'postBudgetPlanActivityId' })
  public postBudgetPlanActivity: PostBudgetPlanActivity;

  @Column()
  budgetYear: string;

  @Column()
  quarter1: string;

  @Column()
  quarter2: string;

  @Column()
  quarter3: string;

  @Column()
  quarter4: string;

  @Column()
  amount: number;

  @Column()
  currency: string;
}

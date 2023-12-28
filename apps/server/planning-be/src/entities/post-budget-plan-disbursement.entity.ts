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
import { BudgetYear } from './budget-year.entity';
import { OrgAudit } from 'src/shared/entities';

@Entity({ name: 'post_budget_plan_disbursements' })
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

  @OneToOne(() => BudgetYear, (budgetYear) => budgetYear.budget)
  @JoinColumn({ name: 'budget_year' })
  public budgetYear: BudgetYear;

  @Column()
  budgetYearName: string;

  @Column()
  quarter: string;

  @Column()
  order: number;

  @Column()
  amount: number;

  @Column()
  currency: string;
}

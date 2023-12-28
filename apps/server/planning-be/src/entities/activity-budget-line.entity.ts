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
import { ItemBudgetLine } from './item-budget-line.entity';
import { Budget } from './budget.entity';
import { OrgAudit } from 'src/shared/entities';

@Entity({ name: 'activity_budget_lines' })
export class ActivityBudgetLine extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  postBudgetPlanActivityId: string;

  @ManyToOne(
    () => PostBudgetPlanActivity,
    (postBudgetPlanActivity) => postBudgetPlanActivity.activityBudgetLines,
  )
  @JoinColumn({ name: 'postBudgetPlanActivityId' })
  public postBudgetPlanActivity: PostBudgetPlanActivity;

  @Column()
  BudgetId: string;

  @ManyToOne(() => Budget, (budget) => budget.activityBudgetLine)
  @JoinColumn({ name: 'budgetId' })
  public budget: Budget;

  @OneToMany(
    () => ItemBudgetLine,
    (itemBudgetLine) => itemBudgetLine.activityBudgetLine,
  )
  itemBudgetLines: ItemBudgetLine[];

  @Column()
  amount: string;
}

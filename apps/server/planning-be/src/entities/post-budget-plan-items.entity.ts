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

@Entity({ name: 'post_budget_plan_items' })
export class PostBudgetPlanItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  postBudgetPlanActivityId: string;

  @ManyToOne(
    () => PostBudgetPlanActivity,
    (postBudgetPlanActivity) => postBudgetPlanActivity.postBudgetPlanItems,
  )
  @JoinColumn({ name: 'postBudgetPlanActivityId' })
  public postBudgetPlanActivity: PostBudgetPlanActivity;

  @Column({ nullable: true })
  budgetId: string;

  @ManyToOne(() => Budget, (budget) => budget.postBudgetPlanItems)
  @JoinColumn({ name: 'budgetId' })
  public budget: Budget;

  @OneToMany(
    () => ItemBudgetLine,
    (itemBudgetLine) => itemBudgetLine.postBudgetPlanItems,
  )
  itemBudgetLines: ItemBudgetLine[];

  @Column()
  itemCode: string;

  @Column()
  description: string;

  @Column({ type: 'json', nullable: true })
  specification: JSON;

  @Column()
  unitPrice: number;

  @Column()
  currency: string;

  @Column()
  quantity: number;

  @Column()
  measurement: string;

  @Column()
  uom: string;
}

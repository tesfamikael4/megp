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

@Entity({ name: 'post_budget_plan_items' })
export class PostBudgetPlanItem extends OrgAudit {
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

  @Column({ nullable: true })
  itemCode: string;

  @Column()
  description: string;

  @Column({ type: 'json', nullable: true })
  specification: JSON;

  @Column({ default: 0, type: 'decimal', precision: 14, scale: 2 })
  unitPrice: number;

  @Column()
  currency: string;

  @Column({ type: 'decimal' })
  quantity: number;

  @Column()
  measurement: string;

  @Column()
  uomName: string;

  @Column()
  classification: string;
}

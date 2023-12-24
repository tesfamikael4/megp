import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { ActivityBudgetLine } from './activity-budget-line.entity';
import { PostBudgetPlanItem } from './post-budget-plan-items.entity';

@Entity({ name: 'item_budget_line' })
export class ItemBudgetLine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  activityCoAtagId: string;

  @ManyToOne(
    () => ActivityBudgetLine,
    (activityBudgetLine) => activityBudgetLine.itemBudgetLines,
  )
  @JoinColumn({ name: 'activityBudgetLineId' })
  public activityBudgetLine: ActivityBudgetLine;

  @Column()
  postBudgetPlanItemsId: string;

  @ManyToOne(
    () => PostBudgetPlanItem,
    (postBudgetPlanItems) => postBudgetPlanItems.itemBudgetLines,
  )
  @JoinColumn({ name: 'postBudgetPlanItemsId' })
  public postBudgetPlanItems: PostBudgetPlanItem;
}

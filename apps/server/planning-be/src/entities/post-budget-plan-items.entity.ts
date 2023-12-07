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
import { ItemCoATag } from './item-coa-tag.entity';

@Entity({ name: 'post_budget_plan_items' })
export class PostBudgetPlanItems {
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

  @OneToMany(() => ItemCoATag, (itemCoAtags) => itemCoAtags.postBudgetPlanItems)
  itemCoAtags: ItemCoATag[];

  @Column()
  itemCodeReferenceType: string;

  @Column()
  itemCode: string;

  @Column({ type: 'json' })
  metaData: JSON;

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

  @Column()
  uomName: string;
}

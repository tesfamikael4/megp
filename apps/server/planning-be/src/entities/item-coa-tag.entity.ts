import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { ActivityCoATag } from './activity-coa-tag.entity';
import { PostBudgetPlanItems } from './post-budget-plan-items.entity';

@Entity({ name: 'item_coa_tags' })
export class ItemCoATag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  activityCoAtagId: string;

  @ManyToOne(
    () => ActivityCoATag,
    (activityCoAtag) => activityCoAtag.itemCoAtags,
  )
  @JoinColumn({ name: 'activityCoAtagId' })
  public activityCoAtag: ActivityCoATag;

  @Column()
  postBudgetPlanItemsId: string;

  @ManyToOne(
    () => PostBudgetPlanItems,
    (postBudgetPlanItems) => postBudgetPlanItems.itemCoAtags,
  )
  @JoinColumn({ name: 'postBudgetPlanItemsId' })
  public postBudgetPlanItems: PostBudgetPlanItems;
}

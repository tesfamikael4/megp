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

@Entity({ name: 'activity_coa_tags' })
export class ActivityCoATag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  postBudgetPlanActivityId: string;

  @ManyToOne(
    () => PostBudgetPlanActivity,
    (postBudgetPlanActivity) => postBudgetPlanActivity.activityCoATags,
  )
  @JoinColumn({ name: 'postBudgetPlanActivityId' })
  public postBudgetPlanActivity: PostBudgetPlanActivity;

  @OneToMany(() => ItemCoATag, (itemCoAtags) => itemCoAtags.activityCoAtag)
  itemCoAtags: ItemCoATag[];

  @Column()
  coAid: string;

  @Column()
  name: string;

  @Column()
  coAcode: string;
}

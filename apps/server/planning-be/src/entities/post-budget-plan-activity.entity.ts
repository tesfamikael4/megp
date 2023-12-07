import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { PostBudgetPlan } from './post-budget-plan.entity';
import { PostBudgetPlanItems } from './post-budget-plan-items.entity';
import { PostBudgetPlanTimeline } from './post-budget-plan-timeline.entity';
import { PostBudgetPlanFrameworkContract } from './post-budget-plan-framework-contract.entity';
import { ActivityCoATag } from './activity-coa-tag.entity';
import { PostBudgetPlanDisbursement } from './post-budget-plan-disbursement.entity';

@Entity({ name: 'post_budget_plan_activities' })
export class PostBudgetPlanActivity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  postBudgetPlanId: string;

  @ManyToOne(
    () => PostBudgetPlan,
    (postBudgetPlan) => postBudgetPlan.postBudgetPlanActivities,
  )
  @JoinColumn({ name: 'postBudgetPlanId' })
  public postBudgetPlan: PostBudgetPlan;

  @OneToMany(
    () => PostBudgetPlanItems,
    (postBudgetPlanItems) => postBudgetPlanItems.postBudgetPlanActivity,
  )
  postBudgetPlanItems: PostBudgetPlanItems[];

  @OneToMany(
    () => PostBudgetPlanTimeline,
    (postBudgetPlanTimelines) => postBudgetPlanTimelines.postBudgetPlanActivity,
  )
  postBudgetPlanTimelines: PostBudgetPlanTimeline[];

  @OneToMany(
    () => PostBudgetPlanDisbursement,
    (postBudgePlantDisbursements) =>
      postBudgePlantDisbursements.postBudgetPlanActivity,
  )
  postBudgePlantDisbursements: PostBudgetPlanDisbursement[];

  @OneToMany(
    () => PostBudgetPlanFrameworkContract,
    (postBudgetPlanFrameworkContracts) =>
      postBudgetPlanFrameworkContracts.postBudgetPlanActivity,
  )
  postBudgetPlanFrameworkContracts: PostBudgetPlanFrameworkContract[];

  @OneToMany(
    () => ActivityCoATag,
    (activityCoATag) => activityCoATag.postBudgetPlanActivity,
  )
  activityCoATags: ActivityCoATag[];

  @Column()
  name: string;

  @Column()
  procurementReference: string;

  @Column()
  description: string;

  @Column()
  totalEstimatedAmount: number;

  @Column()
  calculatedAmount: number;

  @Column()
  currency: string;

  @Column()
  fundingSource: string;

  @Column()
  procurementMethod: string;

  @Column()
  procurementType: string;

  @Column({ default: 'Draft' })
  procurementStatus: string;

  @Column({ type: 'json' })
  donor: JSON;

  @Column()
  isMultiYear: boolean;

  @Column({ type: 'json' })
  multiYearBudget: JSON;

  @Column({ default: 'Others' })
  preference: string;

  @Column({ default: 'Online' })
  procurementProcess: string;

  @Column({ nullable: true })
  remark: string;
}

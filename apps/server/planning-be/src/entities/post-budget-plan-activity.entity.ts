import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  Unique,
  Check,
} from 'typeorm';

import { PostBudgetPlan } from './post-budget-plan.entity';
import { PostBudgetPlanItem } from './post-budget-plan-items.entity';
import { PostBudgetPlanTimeline } from './post-budget-plan-timeline.entity';
import { ActivityBudgetLine } from './activity-budget-line.entity';
import { PostBudgetPlanDisbursement } from './post-budget-plan-disbursement.entity';
import { PostBudgetActivityDocument } from './post-budget-activity-document.entity';
import { PostBudgetRequisitioner } from './post-budget-plan-requisitioner.entity';
import { PostProcurementMechanism } from './post-procurement-mechanism.entity';
import { OrgAudit } from 'src/shared/entities';
import { Budget } from './budget.entity';
import { Reason } from './reason.entity';
import { ProcurementRequisition } from './procurement-requisition.entity';

@Unique(['procurementReference'])
@Entity({ name: 'post_budget_plan_activities' })
@Check('"estimatedAmount" >= 0 AND "calculatedAmount" >= 0')
export class PostBudgetPlanActivity extends OrgAudit {
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

  @Column({ nullable: true })
  budgetId: string;

  @ManyToOne(() => Budget, (budget) => budget.postBudgetPlanActivities)
  @JoinColumn({ name: 'budgetId' })
  public budget?: Budget;

  @OneToMany(
    () => PostBudgetPlanItem,
    (postBudgetPlanItems) => postBudgetPlanItems.postBudgetPlanActivity,
  )
  postBudgetPlanItems: PostBudgetPlanItem[];

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
  postBudgePlanDisbursements: PostBudgetPlanDisbursement[];

  @OneToMany(
    () => PostBudgetActivityDocument,
    (postBudgetActivityDocument) =>
      postBudgetActivityDocument.postBudgetPlanActivity,
  )
  postBudgetActivityDocuments: PostBudgetActivityDocument[];

  @OneToMany(
    () => PostBudgetRequisitioner,
    (postBudgetRequisitioner) => postBudgetRequisitioner.postBudgetPlanActivity,
  )
  postBudgetRequisitioners: PostBudgetRequisitioner[];

  @OneToOne(
    () => PostProcurementMechanism,
    (postProcurementMechanism) =>
      postProcurementMechanism.postBudgetPlanActivity,
  )
  postProcurementMechanism: PostProcurementMechanism;

  @OneToMany(
    () => ActivityBudgetLine,
    (activityBudgetLine) => activityBudgetLine.postBudgetPlanActivity,
  )
  activityBudgetLines: ActivityBudgetLine[];

  @OneToMany(() => Reason, (reasons) => reasons.postBudgetPlanActivity)
  reasons: Reason[];

  @OneToMany(
    () => ProcurementRequisition,
    (procurementRequisitions) => procurementRequisitions.postBudgetActivity,
    {
      cascade: true,
    },
  )
  procurementRequisitions: ProcurementRequisition[];

  @Column()
  name: string;

  @Column()
  procurementReference: string;

  @Column()
  description: string;

  @Column({ default: 0, type: 'decimal', precision: 14, scale: 2 })
  estimatedAmount: number;

  @Column({ default: 0, type: 'decimal', precision: 14, scale: 2 })
  calculatedAmount: number;

  @Column({ default: 'Draft' })
  status: string;

  @Column()
  currency: string;

  @Column()
  isMultiYear: boolean;

  @Column({ nullable: true })
  remark: string;

  @Column({ type: 'jsonb', nullable: true })
  classification: any;

  @Column({ nullable: true, unique: true })
  userReference: string;

  @BeforeInsert()
  generateRandomNumber(): void {
    const randomNum = Math.floor(10000 + Math.random() * 90000); // Generates a random 5-digit number
    this.procurementReference = 'REF-' + randomNum.toString();
  }
}

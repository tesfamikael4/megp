import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Check,
} from 'typeorm';

import { APP } from './app.entity';
import { BudgetYear } from './budget-year.entity';
import { ActivityBudgetLine } from './activity-budget-line.entity';
import { PostBudgetPlanItem } from './post-budget-plan-items.entity';
import { OrgAudit } from 'src/shared/entities';
import { PostBudgetPlanActivity } from './post-budget-plan-activity.entity';
import { ProcurementRequisition } from './procurement-requisition.entity';
import { ProcurementRequisitionItem } from './procurement-requisition-item.entity';

@Entity({ name: 'budget' })
@Check(
  '"availableBudget" >= 0 AND "obligatedBudget" >= 0 AND "revisedBudget" >= 0 AND "allocatedBudget" >= 0 AND "availableBudget" <= "revisedBudget" AND "obligatedBudget" <= "revisedBudget" ',
)
export class Budget extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  budgetYearId: string;

  @ManyToOne(() => BudgetYear, (budgetYear) => budgetYear.budget)
  @JoinColumn({ name: 'budgetYearId' })
  public budgetYears: BudgetYear[];

  @Column()
  appId: string;

  @ManyToOne(() => APP, (app) => app.budgets)
  @JoinColumn({ name: 'appId' })
  public app: APP;

  @OneToMany(
    () => ActivityBudgetLine,
    (activityBudgetLine) => activityBudgetLine.budget,
  )
  activityBudgetLine: ActivityBudgetLine[];

  @OneToMany(
    () => PostBudgetPlanItem,
    (postBudgetPlanItem) => postBudgetPlanItem.budget,
  )
  postBudgetPlanItems: PostBudgetPlanItem[];

  @OneToMany(
    () => PostBudgetPlanActivity,
    (postBudgetPlanActivities) => postBudgetPlanActivities.budget,
  )
  postBudgetPlanActivities: PostBudgetPlanActivity[];

  @OneToMany(
    () => ProcurementRequisition,
    (procurementRequisitions) => procurementRequisitions.budget,
  )
  procurementRequisitions: ProcurementRequisition[];

  @OneToMany(
    () => ProcurementRequisitionItem,
    (procurementRequisitionItems) => procurementRequisitionItems.budget,
  )
  procurementRequisitionItems: ProcurementRequisitionItem[];

  @Column({ nullable: true })
  type: string;

  @Column({ unique: true })
  budgetCode: string;

  @Column()
  description: string;

  @Column()
  currency: string;

  @Column()
  fundingSource: string;

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  allocatedBudget: number;

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  revisedBudget: number;

  @Column({ default: 0, type: 'decimal', precision: 14, scale: 2 })
  obligatedBudget: number;

  @Column({ default: 0, type: 'decimal', precision: 14, scale: 2 })
  availableBudget: number;
}

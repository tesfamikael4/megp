import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';

import { PreBudgetPlan } from './pre-budget-plan.entity';
import { PreBudgetPlanItems } from './pre-budget-plan-items.entity';
import { PreBudgetPlanTimeline } from './pre-budget-plan-timeline.entity';
import { PreBudgetRequisitioner } from './pre-budget-plan-requisitioner.entity';
import { PreProcurementMechanism } from './pre-procurement-mechanism.entity';
import { OrgAudit } from 'src/shared/entities';
import { PreBudgetActivityDocument } from './pre-budget-activity-document.entity';

@Entity({ name: 'pre_budget_plan_activities' })
export class PreBudgetPlanActivity extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  preBudgetPlanId: string;

  @ManyToOne(
    () => PreBudgetPlan,
    (preBudgetPlan) => preBudgetPlan.preBudgetPlanActivities,
  )
  @JoinColumn({ name: 'preBudgetPlanId' })
  public preBudgetPlan: PreBudgetPlan;

  @OneToMany(
    () => PreBudgetPlanItems,
    (preBudgetPlanItems) => preBudgetPlanItems.preBudgetPlanActivity,
  )
  preBudgetPlanItems: PreBudgetPlanItems[];

  @OneToMany(
    () => PreBudgetPlanTimeline,
    (preBudgetPlanTimelines) => preBudgetPlanTimelines.preBudgetPlanActivity,
  )
  preBudgetPlanTimelines: PreBudgetPlanTimeline[];

  @OneToMany(
    () => PreProcurementMechanism,
    (preProcurementMechanism) => preProcurementMechanism.preBudgetPlanActivity,
  )
  preProcurementMechanisms: PreProcurementMechanism[];

  @OneToMany(
    () => PreBudgetRequisitioner,
    (preBudgetRequisitioner) => preBudgetRequisitioner.preBudgetPlanActivity,
  )
  preBudgetRequisitioners: PreBudgetRequisitioner[];

  @OneToMany(
    () => PreBudgetActivityDocument,
    (preBudgetActivityDocument) =>
      preBudgetActivityDocument.preBudgetPlanActivity,
  )
  preBudgetActivityDocuments: PreBudgetActivityDocument[];

  @Column()
  name: string;

  @Column()
  procurementReference: string;

  @Column()
  description: string;

  @Column({ default: 0 })
  estimatedAmount: number;

  @Column({ default: 0 })
  calculatedAmount: number;

  @Column()
  currency: string;

  @Column({ default: 'Draft' })
  status: string;

  @Column()
  isMultiYear: boolean;

  @Column({ nullable: true })
  remark: string;

  @Column({ type: 'jsonb', nullable: true })
  classification: any;

  @BeforeInsert()
  generateRandomNumber(): void {
    const randomNum = Math.floor(10000 + Math.random() * 90000); // Generates a random 5-digit number
    this.procurementReference = 'REF-' + randomNum.toString();
  }
}

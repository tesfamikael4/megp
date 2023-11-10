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
import { PreBudgePlantDisbursement } from './pre-budge-plant-disbursement.entity';
import { PreBudgetPlanFrameworkContract } from './pre-budget-plan-framework-contract.entity';

@Entity({ name: 'pre_budget_plan_activities' })
export class PreBudgetPlanActivity {
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
    () => PreBudgePlantDisbursement,
    (preBudgePlantDisbursements) =>
      preBudgePlantDisbursements.preBudgetPlanActivity,
  )
  preBudgePlantDisbursements: PreBudgePlantDisbursement[];

  @OneToMany(
    () => PreBudgetPlanFrameworkContract,
    (preBudgetPlanFrameworkContracts) =>
      preBudgetPlanFrameworkContracts.preBudgetPlanActivity,
  )
  preBudgetPlanFrameworkContracts: PreBudgetPlanFrameworkContract[];

  @Column()
  name: string;

  @Column({ default: 'Ref-' })
  procurementReference: string;

  @Column()
  description: string;

  @Column({ default: 0 })
  totalEstimatedAmount: number;

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

  @Column()
  indigenousPreference: boolean;

  @Column({ type: 'json' })
  preferenceValue: JSON;

  @Column({ nullable: true })
  remark: string;

  @BeforeInsert()
  generateRandomNumber(): void {
    const randomNum = Math.floor(10000 + Math.random() * 90000); // Generates a random 5-digit number
    this.procurementReference += randomNum.toString();
  }
}

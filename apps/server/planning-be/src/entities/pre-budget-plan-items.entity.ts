import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { PreBudgetPlanActivity } from './pre-budget-plan-activity.entity';

@Entity({ name: 'pre_budget_plan_items' })
export class PreBudgetPlanItems {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  preBudgetPlanActivityId: string;

  @ManyToOne(
    () => PreBudgetPlanActivity,
    (preBudgetPlanActivity) => preBudgetPlanActivity.preBudgetPlanItems,
  )
  @JoinColumn({ name: 'preBudgetPlanActivityId' })
  public preBudgetPlanActivity: PreBudgetPlanActivity;

  @Column({ default: 'UNSPSC' })
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

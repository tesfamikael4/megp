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

import { PreBudgetPlanActivity } from './pre-budget-plan-activity.entity';
import { OrgAudit } from 'src/shared/entities';

@Entity({ name: 'pre_budget_plan_items' })
@Check('"quantity" >= 0 AND "unitPrice" >= 0')
export class PreBudgetPlanItems extends OrgAudit {
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

  @Column({ nullable: true })
  itemCode: string;

  @Column()
  description: string;

  @Column({ default: 0, type: 'decimal', precision: 14, scale: 2 })
  unitPrice: number;

  @Column()
  currency: string;

  @Column({ type: 'decimal' })
  quantity: number;

  @Column()
  measurement: string;

  @Column()
  uomName: string;

  @Column()
  classification: string;
}

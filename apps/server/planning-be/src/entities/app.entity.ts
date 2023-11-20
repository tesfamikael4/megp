import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { PreBudgetPlan } from './pre-budget-plan.entity';

@Entity({ name: 'apps' })
export class APP {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  planName: string;

  @Column()
  budgetYear: string;

  @Column()
  description: string;

  @OneToOne(() => PreBudgetPlan, (preBudgetPlans) => preBudgetPlans.app, {
    cascade: true,
  })
  preBudgetPlans: PreBudgetPlan;
}

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
import { PostBudgetPlan } from './post-budget-plan.entity';
import { Budget } from './budget.entity';

@Entity({ name: 'apps' })
export class APP {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  planName: string;

  @Column()
  budgetYear: string;

  @Column({ nullable: true })
  description: string;

  @OneToOne(() => PreBudgetPlan, (preBudgetPlans) => preBudgetPlans.app, {
    cascade: true,
  })
  preBudgetPlans: PreBudgetPlan;

  @OneToOne(() => PostBudgetPlan, (postBudgetPlans) => postBudgetPlans.app, {
    cascade: true,
  })
  postBudgetPlans: PostBudgetPlan;

  @OneToMany(() => Budget, (budgets) => budgets.app, {
    cascade: true,
  })
  budgets: Budget[];
}

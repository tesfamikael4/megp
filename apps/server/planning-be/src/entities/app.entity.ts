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
import { OrgAudit } from 'src/shared/entities';
import { BudgetYear } from './budget-year.entity';

@Entity({ name: 'apps' })
export class APP extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  planName: string;

  @Column()
  budgetYear: string;

  @Column()
  budgetYearId: string;

  @ManyToOne(() => BudgetYear, (budgetYear) => budgetYear.budget)
  @JoinColumn({ name: 'budgetYearId' })
  public budgetYears: BudgetYear;

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

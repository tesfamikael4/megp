import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Budget } from './budget.entity';
import { PostBudgetPlanDisbursement } from './post-budget-plan-disbursement.entity';
import { APP } from './app.entity';
import { OrgAudit } from 'src/shared/entities';

@Entity({ name: 'budget_years' })
export class BudgetYear extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Budget, (budget) => budget.budgetYears)
  budget: Budget;

  @OneToMany(() => APP, (app) => app.budgetYears, {
    cascade: true,
  })
  app: APP;

  @Column()
  name: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;
}

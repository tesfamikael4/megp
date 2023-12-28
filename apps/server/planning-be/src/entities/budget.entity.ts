import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { APP } from './app.entity';
import { BudgetYear } from './budget-year.entity';
import { ActivityBudgetLine } from './activity-budget-line.entity';
import { PostBudgetPlanItem } from './post-budget-plan-items.entity';
import { OrgAudit } from 'src/shared/entities';

@Entity({ name: 'budget' })
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

  @Column({ nullable: true })
  type: string;

  @Column()
  budgetCode: string;

  @Column()
  description: string;

  @Column()
  currency: string;

  @Column()
  fundingSource: string;

  @Column({ type: 'bigint' })
  allocatedBudget: number;

  @Column({ type: 'bigint' })
  revisedBudget: number;

  @Column({ type: 'bigint' })
  obligatedBudget: number;

  @Column({ type: 'bigint' })
  availableBudget: number;
}

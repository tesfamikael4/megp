import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  Check,
} from 'typeorm';
import { Budget } from './budget.entity';
import { PostBudgetPlanDisbursement } from './post-budget-plan-disbursement.entity';
import { APP } from './app.entity';
import { OrgAudit } from 'src/shared/entities';
import { ProcurementRequisition } from './procurement-requisition.entity';

@Entity({ name: 'budget_years' })
@Check('"startDate" < "endDate"')
export class BudgetYear extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Budget, (budget) => budget.budgetYears)
  budget: Budget;

  @OneToMany(() => APP, (app) => app.budgetYears, {
    cascade: true,
  })
  app: APP;

  @OneToMany(
    () => ProcurementRequisition,
    (procurementRequisition) => procurementRequisition.budgetYear,
    {
      cascade: true,
    },
  )
  procurementRequisitions: ProcurementRequisition;

  @Column()
  name: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;
}

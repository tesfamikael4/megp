import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';
import { ProcurementRequisition } from './procurement-requisition.entity';

@Entity({ name: 'procurement_requisition_budget_lines' })
export class ProcurementRequisitionBudgetLine extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  procurementRequisitionId: string;

  @Column({ type: 'uuid' })
  annualProcurementPlanBudgetLineId: string;

  @Column({ type: 'double precision', default: 0.0 })
  amount: number;

  @ManyToOne(
    () => ProcurementRequisition,
    (procurementRequisition) =>
      procurementRequisition.procurementRequisitionBudgetLines,
  )
  @JoinColumn({ name: 'procurementRequisitionId' })
  public procurementRequisition: ProcurementRequisition;
}

import {
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
  Unique,
  Check,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { OrgAudit } from 'src/shared/entities/audit.entity';
import { ProcurementRequisition } from './procurement-requisition.entity';
import { BudgetCodeResponse } from 'src/shared/entities';
import { Budget } from './budget.entity';
@Entity({ name: 'procurement_mechanism_items' })
@Check('"unitPrice" >= 0 AND "quantity" >= 0')
@Unique([
  'procurementRequisitionId',
  'itemCode',
  'currency',
  'measurement',
  'deletedAt',
])
export class ProcurementRequisitionItem extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '00000000-0000-0000-0000-000000000000' })
  itemCode: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 0, type: 'decimal', precision: 14, scale: 2 })
  unitPrice: number;

  @Column()
  currency: string;

  @Column({ type: 'decimal' })
  quantity: number;

  @Column()
  measurement: string;

  @Column({ nullable: true })
  uom: string;

  @Column({ nullable: true })
  bom: string;

  @Column({ nullable: true })
  budgetId: string;

  @ManyToOne(() => Budget, (budget) => budget.procurementRequisitionItems)
  @JoinColumn({ name: 'budgetId' })
  public budget: Budget;

  @Column({ type: 'jsonb' })
  classification: any;

  @Column({ type: 'uuid' })
  procurementRequisitionId: string;

  @ManyToOne(
    () => ProcurementRequisition,
    (procurementRequisition) =>
      procurementRequisition.procurementRequisitionItems,
  )
  @JoinColumn({ name: 'procurementRequisitionId' })
  public procurementRequisition: ProcurementRequisition;
}

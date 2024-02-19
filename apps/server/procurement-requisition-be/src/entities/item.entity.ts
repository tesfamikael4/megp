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
@Entity({ name: 'items' })
@Check('"unitPrice" >= 0 AND "quantity" >= 0')
@Unique([
  'procurementRequisitionId',
  'itemCode',
  'currency',
  'measurement',
  'deletedAt',
])
export class Item extends OrgAudit {
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

  @Column()
  uom: string;

  @Column({ type: 'jsonb' })
  budgetCode: BudgetCodeResponse;

  @Column({ type: 'jsonb' })
  classification: any;

  @Column({ type: 'uuid' })
  procurementRequisitionId: string;

  @ManyToOne(
    () => ProcurementRequisition,
    (procurementRequisition) => procurementRequisition.items,
  )
  @JoinColumn({ name: 'procurementRequisitionId' })
  public procurementRequisition: ProcurementRequisition;
}

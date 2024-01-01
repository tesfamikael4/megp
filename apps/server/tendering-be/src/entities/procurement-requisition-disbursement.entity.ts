import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';
import { ProcurementRequisition } from './procurement-requisition.entity';
@Entity({ name: 'procurement_requisition_disbursements' })
export class ProcurementRequisitionDisbursement extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quarter: string;

  @Column({ type: 'integer', unsigned: true })
  order: number;

  @Column({ type: 'double precision', default: 0.0 })
  amount: number;

  @Column()
  currency: string;

  @Column({ type: 'uuid' })
  procurementRequisitionId: string;

  @Column({ type: 'jsonb' })
  budgetYear: JSON;

  @ManyToOne(
    () => ProcurementRequisition,
    (procurementRequisition) =>
      procurementRequisition.procurementRequisitionDisbursements,
  )
  @JoinColumn({ name: 'procurementRequisitionId' })
  public procurementRequisition: ProcurementRequisition;
}

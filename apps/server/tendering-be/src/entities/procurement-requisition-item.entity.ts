import {
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
  Unique,
  OneToMany,
  PrimaryColumn,
  BeforeInsert,
} from 'typeorm';

import { v5 as uuidv4 } from 'uuid';
import { Audit } from 'src/shared/entities/audit.entity';
import { ProcurementRequisition } from './procurement-requisition.entity';
import { ProcurementRequisitionItemReference } from './procurement-requisition-item-reference.entity';
@Entity({ name: 'procurement_requisition_items' })
@Unique(['procurementRequisitionId', 'itemCode'])
export class ProcurementRequisitionItem extends Audit {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  itemCode: string;

  @Column()
  description: string;

  @Column({ type: 'double precision', default: 0.0 })
  unitPrice: number;

  @Column()
  currency: string;

  @Column({ type: 'double precision', default: 0.0 })
  quantity: number;

  @Column()
  measurement: string;

  @Column()
  classification: string;

  @Column()
  uoM: string;

  @Column({ type: 'uuid', nullable: true })
  annualProcurementPlanBudgetLineId: string;
  @Column({ type: 'uuid' })
  procurementRequisitionId: string;

  @ManyToOne(
    () => ProcurementRequisition,
    (procurementRequisition) =>
      procurementRequisition.procurementRequisitionItems,
  )
  @JoinColumn({ name: 'procurementRequisitionId' })
  public procurementRequisition: ProcurementRequisition;

  @OneToMany(
    () => ProcurementRequisitionItemReference,
    (procurementRequisitionItemReferences) =>
      procurementRequisitionItemReferences,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  procurementRequisitionItemReferences: ProcurementRequisitionItemReference[];

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}

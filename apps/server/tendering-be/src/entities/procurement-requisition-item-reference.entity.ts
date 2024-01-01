import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';

@Entity({ name: 'procurement_requisition_item_references' })
export class ProcurementRequisitionItemReference extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  procurementRequisitionItemId: string;

  @Column({ type: 'uuid' })
  annualProcurementPlanItemId: string;
}

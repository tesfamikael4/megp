import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';
import { ProcurementRequisition } from './procurement-requisition.entity';
@Entity({ name: 'procurement_requisition_mechanisms' })
export class ProcurementRequisitionMechanism extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  procurementRequisitionId: string;

  @Column({ type: 'text' })
  fundingSource: string;

  @Column()
  procurementMethod: string;

  @Column()
  procurementType: string;

  @Column({ type: 'jsonb' })
  donor: string[];

  @Column({ type: 'jsonb' })
  targetGroup: string[];

  @Column({ default: true })
  isOnline: boolean;

  @Column({ type: 'jsonb' })
  contract: JSON;

  @OneToOne(
    () => ProcurementRequisition,
    (procurementRequisition) =>
      procurementRequisition.procurementRequisitionMechanisms,
  )
  @JoinColumn({ name: 'procurementRequisitionId' })
  public procurementRequisition: ProcurementRequisition;
}

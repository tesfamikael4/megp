import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import { OrgAudit } from 'src/shared/entities/audit.entity';
import { ProcurementRequisition } from './procurement-requisition.entity';

@Entity({ name: 'procurement_mechanisms' })
export class ProcurementMechanism extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fundingSource: string;

  @Column()
  procurementMethod: string;

  @Column()
  procurementType: string;

  @Column({ type: 'jsonb' })
  donor: string[];

  @Column({ type: 'jsonb' })
  targetGroup: any;

  @Column({ default: true })
  isOnline: boolean;

  @Column({ type: 'json' })
  contract: JSON;

  @Column({ type: 'uuid' })
  procurementRequisitionId: string;

  @OneToOne(
    () => ProcurementRequisition,
    (procurementRequisition) => procurementRequisition.procurementMechanisms,
  )
  @JoinColumn({ name: 'procurementRequisitionId' })
  public procurementRequisition: ProcurementRequisition;
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';
import { AnnualProcurementPlanActivity } from './annual-procurement-plan-activity.entity';

@Entity({ name: 'procurement_mechanisms' })
export class ProcurementMechanism extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  fundingSource: string;

  @Column()
  procurementMethod: string;

  @Column()
  procurementType: string;

  @Column()
  donor: string;

  @Column({ type: 'jsonb' })
  targetGroup: string[];

  @Column({ default: false })
  isOnline: boolean;

  @Column({ type: 'jsonb' })
  contract: string;

  @Column({ type: 'uuid' })
  annualProcurementPlanActivityId: string;

  @OneToOne(
    () => AnnualProcurementPlanActivity,
    (annualProcurementPlanActivity) =>
      annualProcurementPlanActivity.procurementMechanisms,
  )
  @JoinColumn({ name: 'annualProcurementPlanActivityId' })
  public annualProcurementPlanActivity: AnnualProcurementPlanActivity;
}

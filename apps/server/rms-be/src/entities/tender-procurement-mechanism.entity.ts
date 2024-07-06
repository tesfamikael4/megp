import { Audit } from 'megp-shared-be';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TenderNotice } from './tender-notice.entity';

@Entity({ name: 'tender_procurement_mechanisms' })
export class TenderProcurementMechanism extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenderId: string;

  @OneToOne(() => TenderNotice, (tender) => tender.tenderProcurementMechanism)
  @JoinColumn({ name: 'tenderId' })
  tenderNotice: TenderNotice;

  @Column({ type: 'json' })
  PRProcurementMechanisms: any;

  @Column({ nullable: true })
  invitationType: string;

  @Column({ nullable: true })
  marketApproach: string;

  @Column({ nullable: true })
  stageType: string;

  @Column({ nullable: true })
  stage: number;
}

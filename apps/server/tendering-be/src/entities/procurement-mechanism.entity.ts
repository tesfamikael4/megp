import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tender } from './tender.entity';

@Entity({ name: 'procurement_mechanisms' })
export class ProcurementMechanism extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenderId: string;

  @OneToOne(() => Tender, (tender) => tender.procurementMechanism)
  @JoinColumn()
  tender: Tender;

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

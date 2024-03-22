import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tender } from './tender.entity';

@Entity({ name: 'tender_participation_fees' })
export class TenderParticipationFee extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenderId: string;

  @OneToOne(() => Tender, (tender) => tender.tenderParticipationFee)
  @JoinColumn()
  tender: Tender;

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  amount: number;

  @Column()
  currency: string;

  @Column()
  method: string;
}

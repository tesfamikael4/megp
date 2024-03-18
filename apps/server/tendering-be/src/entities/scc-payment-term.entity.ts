import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tender } from './tender.entity';

@Entity({ name: 'scc_payment_terms' })
export class SccPaymentTerm extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenderId: string;

  @ManyToOne(() => Tender, (tender) => tender.sccPaymentTerms)
  @JoinColumn()
  tender: Tender;

  @Column('text', { array: true })
  contractCurrency: string[];

  @Column('text', { array: true })
  paymentMode: string[];

  @Column({ default: true })
  advancePaymentAllowed: boolean;

  @Column({ default: 0 })
  advancePaymentLimit: number;

  @Column()
  paymentReleasePeriod: number;

  @Column()
  latePaymentPenalty: number;
}

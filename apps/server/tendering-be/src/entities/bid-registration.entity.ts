import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Tender } from './tender.entity';

@Entity({ name: 'bid_registrations' })
@Unique(['tenderId', 'bidderId'])
export class BidRegistration extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenderId: string;

  @ManyToOne(() => Tender, (tender) => tender.bidRegistrations)
  @JoinColumn()
  tender: Tender;

  @Column()
  bidderId: string;

  @Column({ nullable: true })
  paymentInvoice: string;

  @Column({ nullable: true })
  paymentMethod: string;

  @Column({ type: 'jsonb', nullable: true })
  payment: any;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  amount: number;

  @Column({ nullable: true })
  currency: string;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'REGISTERED', 'SUBMITTED'],
    default: 'REGISTERED',
  })
  status: string;
}

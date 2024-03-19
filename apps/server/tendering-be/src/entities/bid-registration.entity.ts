import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Tender } from './tender.entity';
import { BidRegistrationDetail } from './bid-registration-detail.entity';
import { BidRegistrationStatusEnum } from 'src/shared/enums';

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
    enum: BidRegistrationStatusEnum,
    default: BidRegistrationStatusEnum.REGISTERED,
  })
  status: string;

  @OneToMany(
    () => BidRegistrationDetail,
    (bidRegistrationDetails) => bidRegistrationDetails.bidRegistration,
  )
  bidRegistrationDetails: BidRegistrationDetail[];
}

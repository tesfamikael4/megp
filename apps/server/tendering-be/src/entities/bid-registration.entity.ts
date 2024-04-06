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
import { BidRegistrationStatusEnum, EnvelopTypeEnum } from 'src/shared/enums';
import { BidResponseTender } from './bid-response-tender.entity';

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

  @Column()
  bidderName: string;

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

  @Column({ type: 'text', nullable: true })
  financialResponse: string;

  @Column({ type: 'text', nullable: true })
  technicalResponse: string;

  @Column({ type: 'text', nullable: true })
  response: string;

  @Column()
  salt: string;

  @Column({
    type: 'enum',
    enum: EnvelopTypeEnum,
  })
  envelopType: string;

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

  @OneToMany(
    () => BidResponseTender,
    (bidResponseTenders) => bidResponseTenders.bidRegistration,
  )
  bidResponseTenders: BidResponseTender[];
}

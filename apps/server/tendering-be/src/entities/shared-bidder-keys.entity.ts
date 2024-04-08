import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BidRegistrationDetail } from './bid-registration-detail.entity';

@Entity({ name: 'shared_bidder_keys' })
export class SharedBidderKey {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bidRegistrationDetailId: string;

  @ManyToOne(
    () => BidRegistrationDetail,
    (bidRegistrationDetail) => bidRegistrationDetail.sharedBidderKeys,
  )
  @JoinColumn()
  bidRegistrationDetail: BidRegistrationDetail;

  @Column()
  envelopeType: string;

  @Column()
  privateKey: string;

  @Column({ nullable: true })
  contactName: string;

  @Column({ nullable: true })
  contactPhoneNumber: string;

  @Column('timestamp')
  timestamp: Date;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { BidRegistration } from './bid-registration.entity';
import { Audit } from 'src/shared/entities';
import { DocumentTypeEnum } from 'src/shared/enums';

@Entity({ name: 'shared_bidder_keys' })
@Unique(['bidRegistrationId', 'envelopeType'])
export class SharedBidderKey extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bidRegistrationId: string;

  @ManyToOne(
    () => BidRegistration,
    (bidRegistration) => bidRegistration.sharedBidderKeys,
  )
  @JoinColumn()
  bidRegistration: BidRegistration;

  @Column({ type: 'enum', enum: DocumentTypeEnum })
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

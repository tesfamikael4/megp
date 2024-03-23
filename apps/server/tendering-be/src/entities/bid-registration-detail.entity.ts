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
import { BidRegistration } from './bid-registration.entity';
import { Lot } from './lot.entity';
import { BidRegistrationDetailStatusEnum } from 'src/shared/enums';
import { BidResponse } from './bid-response.entity';

@Entity({ name: 'bid_registration_details' })
@Unique(['bidRegistrationId', 'lotId'])
export class BidRegistrationDetail extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bidRegistrationId: string;

  @ManyToOne(() => BidRegistration, (tender) => tender.bidRegistrationDetails)
  @JoinColumn()
  bidRegistration: BidRegistration;

  @Column()
  lotId: string;

  @ManyToOne(() => Lot, (lot) => lot.bidRegistrationDetails)
  @JoinColumn()
  lot: Lot;

  @Column({
    type: 'enum',
    enum: BidRegistrationDetailStatusEnum,
    default: BidRegistrationDetailStatusEnum.NOT_SUBMITTED,
  })
  status: string;

  @OneToMany(
    () => BidResponse,
    (bidResponses) => bidResponses.bidRegistrationDetail,
  )
  bidResponses: BidResponse[];
}

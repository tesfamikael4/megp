import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { BidRegistrationDetail } from './bid-registration-detail.entity';

@Entity({ name: 'bid_response_lots' })
@Unique(['bidRegistrationDetailId', 'key'])
export class BidResponseLot extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bidRegistrationDetailId: string;

  @ManyToOne(() => BidRegistrationDetail, (tender) => tender.bidResponseLots)
  @JoinColumn()
  bidRegistrationDetail: BidRegistrationDetail;

  @Column()
  documentType: string;

  @Column()
  key: string;

  @Column({ type: 'text' })
  value: string;
}

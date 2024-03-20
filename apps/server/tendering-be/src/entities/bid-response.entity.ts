import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BidRegistrationDetail } from './bid-registration-detail.entity';

@Entity({ name: 'bid_responses' })
export class BidResponse extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bidRegistrationDetailId: string;

  @ManyToOne(() => BidRegistrationDetail, (tender) => tender.bidResponses)
  @JoinColumn()
  bidRegistrationDetail: BidRegistrationDetail;

  @Column()
  documentType: string;

  @Column()
  key: string;

  @Column({ type: 'text' })
  value: string;
}

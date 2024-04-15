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
import { DocumentTypeEnum } from 'src/shared/enums';

@Entity({ name: 'opened_bid_response_lots' })
@Unique(['bidRegistrationDetailId', 'key'])
export class OpenedBidResponseLot extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bidRegistrationDetailId: string;

  @ManyToOne(
    () => BidRegistrationDetail,
    (tender) => tender.openedBidResponseLots,
  )
  @JoinColumn()
  bidRegistrationDetail: BidRegistrationDetail;

  @Column({ type: 'enum', enum: DocumentTypeEnum })
  documentType: string;

  @Column()
  key: string;

  @Column({ type: 'jsonb' })
  value: any;
}

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
import { SpdBidForm } from './spd-bid-form.entity';

@Entity({ name: 'bid_response_documents' })
@Unique(['bidRegistrationDetailId', 'bidFormId', 'key'])
export class BidResponseDocument extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bidRegistrationDetailId: string;

  @ManyToOne(() => BidRegistrationDetail, (tender) => tender.bidResponseItems)
  @JoinColumn()
  bidRegistrationDetail: BidRegistrationDetail;

  @Column()
  bidFormId: string;

  @ManyToOne(() => SpdBidForm, (item) => item.bidResponseDocuments)
  @JoinColumn()
  bidForm: SpdBidForm;

  @Column({ type: 'enum', enum: DocumentTypeEnum })
  documentType: string;

  @Column()
  key: string;

  @Column({ type: 'text' })
  value: string;
}

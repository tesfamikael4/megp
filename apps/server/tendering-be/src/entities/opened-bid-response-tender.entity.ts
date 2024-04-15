import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { BidRegistration } from './bid-registration.entity';
import { DocumentTypeEnum } from 'src/shared/enums';

@Entity({ name: 'opened_bid_response_tenders' })
@Unique(['bidRegistrationId', 'key'])
export class OpenedBidResponseTender extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bidRegistrationId: string;

  @ManyToOne(() => BidRegistration, (tender) => tender.openedBidResponseTenders)
  @JoinColumn()
  bidRegistration: BidRegistration;

  @Column({ type: 'enum', enum: DocumentTypeEnum })
  documentType: string;

  @Column()
  key: string;

  @Column({ type: 'text' })
  value: string;
}

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
import { Item } from './tender-item.entity';
import { DocumentTypeEnum } from 'src/shared/enums';

@Entity({ name: 'bid_response_items' })
@Unique(['bidRegistrationDetailId', 'itemId', 'key'])
export class BidResponseItem extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bidRegistrationDetailId: string;

  @ManyToOne(() => BidRegistrationDetail, (tender) => tender.bidResponseItems)
  @JoinColumn()
  bidRegistrationDetail: BidRegistrationDetail;

  @Column()
  itemId: string;

  @ManyToOne(() => Item, (item) => item.bidResponseItems)
  @JoinColumn()
  item: Item;

  @Column({ type: 'enum', enum: DocumentTypeEnum })
  documentType: string;

  @Column()
  key: string;

  @Column({ type: 'text' })
  value: string;
}

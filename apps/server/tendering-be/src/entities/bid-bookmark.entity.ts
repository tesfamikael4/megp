import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Tender } from './tender.entity';

@Entity({ name: 'bid_bookmarks' })
@Unique(['tenderId', 'bidderId'])
export class BidBookmark extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenderId: string;

  @ManyToOne(() => Tender, (tender) => tender.bidBookmarks)
  @JoinColumn()
  tender: Tender;

  @Column()
  bidderId: string;

  // @Column({ name: 'external_organizations_name', nullable: true })
  // bidderName: string;

  @Column({
    type: 'enum',
    enum: ['BOOKMARKED', 'REGISTERED'],
    default: 'BOOKMARKED',
  })
  status: string;
}

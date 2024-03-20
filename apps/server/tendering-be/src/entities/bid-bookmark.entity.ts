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
import { BidBookmarkStatusEnum } from 'src/shared/enums';

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

  @Column()
  bidderName: string;

  @Column({
    type: 'enum',
    enum: BidBookmarkStatusEnum,
    default: BidBookmarkStatusEnum.BOOKMARKED,
  })
  status: string;
}

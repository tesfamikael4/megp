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

  @ManyToOne(() => Tender, (tender) => tender.spd)
  @JoinColumn()
  tender: Tender;

  @Column()
  bidderId: string;
}

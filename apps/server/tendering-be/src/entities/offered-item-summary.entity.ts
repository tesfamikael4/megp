import { OrgAudit } from 'src/shared/entities';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity({ name: 'offered-item-summaries' })
export class OfferedItemSummary extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @Column('uuid')
  // tenderId: string;

  // @ManyToOne(type => Tender, tender => tender.bidderResponses)
  // tender: Tender;

  // @Column('uuid')
  // lotId: string;

  // @ManyToOne(type => Bidder, bidder => bidder.bidderResponses)
  // bidder: Bidder;

  // @Column('uuid')
  // itemId: string;

  // @ManyToOne(type => Item, item => item.bidderResponses)
  // item: Item;

  @Column({ default: 0, type: 'decimal', precision: 14, scale: 2 })
  quantity: number;

  @Column({ default: 0, type: 'decimal', precision: 14, scale: 2 })
  amount: number;

  @Column({ default: 0, type: 'decimal', precision: 14, scale: 2 })
  offeredPrice: number;

  @Column('numeric')
  tax: number;

  @Column()
  currency: string;

  @Column({ default: 0, type: 'decimal', precision: 14, scale: 2 })
  exchangeRate: number;

  @Column('timestamp')
  timestamp: Date;
}

import { OrgAudit } from 'src/shared/entities';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity({ name: 'offered-item-breakdowns' })
export class OfferedItemBreakdown extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @Column('uuid')
  // bidderResponseId: string;

  // @ManyToOne(type => BidderResponse, bidderResponse => bidderResponse.bidderBillOfQuantities)
  // bidderResponse: BidderResponse;

  @Column('uuid')
  billOfQuantityId: string;

  @Column({ nullable: true })
  parentCode: string;

  @Column()
  code: string;

  @Column()
  category: string;

  @Column({ default: 0, type: 'decimal', precision: 14, scale: 2 })
  adjustedQuantity: number;

  @Column({ default: 0, type: 'decimal', precision: 14, scale: 2 })
  offeredUnitPrice: number;

  @Column({
    default: 0,
    type: 'decimal',
    precision: 14,
    scale: 2,
    nullable: true,
  })
  originalQuantity: number;

  @Column({ default: 0, type: 'decimal', precision: 14, scale: 2 })
  totalAmount: number;

  @Column()
  currency: string;

  @Column({
    default: 0,
    type: 'decimal',
    precision: 14,
    scale: 2,
    nullable: true,
  })
  exchangeRate: number;
}

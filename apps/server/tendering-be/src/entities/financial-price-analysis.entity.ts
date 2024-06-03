import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrgAudit } from 'src/shared/entities';
import { Lot } from './lot.entity';
import { Item } from './tender-item.entity';

@Entity({ name: 'financial_price_analyses' })
export class FinancialPriceAnalysis extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  lotId: string;

  @ManyToOne(() => Lot, (lot) => lot.priceAdjustingFactors)
  @JoinColumn({ name: 'lotId' })
  lot: Lot;

  @Column({ type: 'uuid' })
  itemId: string;

  @ManyToOne(() => Item, (item) => item.priceAdjustingFactors)
  @JoinColumn({ name: 'itemId' })
  item: Item;

  @Column('uuid')
  evaluatorId: string;

  @Column()
  evaluatorName: string;

  @Column()
  currency: string;

  @Column()
  calculatedBidUnitPrice: number;

  @Column()
  marketUnitPrice: number;

  @Column()
  difference: number;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { OrgAudit } from 'src/shared/entities';
import { Lot } from './lot.entity';
import { ExchangeRateDetail } from './exchange-rate-detail.entity';
import { Item } from './tender-item.entity';

@Entity({ name: 'bid_price_evaluations' })
export class BidPriceEvaluation extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  lotId: string;

  @ManyToOne(() => Lot, (lot) => lot.bidPriceEvaluations)
  @JoinColumn({ name: 'lotId' })
  lot: Lot;

  @Column({ type: 'uuid' })
  itemId: string;

  @ManyToOne(() => Item, (item) => item.bidPriceEvaluations)
  @JoinColumn({ name: 'itemId' })
  item: Item;

  @Column('uuid')
  evaluatorId: string;

  @Column('uuid')
  evaluatorName: string;

  @Column()
  isTeamLead: boolean;

  @Column()
  offeredPrice: number;

  @Column()
  bidPrice: number;
}

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
import { ExchangeRate } from './exchange-rate.entity';
import { Item } from './tender-item.entity';
import { PriceAdjustingFactorEnum } from 'src/shared/enums/price-adjusting-factor.enum';

@Entity({ name: 'price_adjusting_factors' })
export class PriceAdjustingFactor extends OrgAudit {
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

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  amount: number;

  @Column({
    type: 'enum',
    enum: PriceAdjustingFactorEnum,
  })
  type: string;
}

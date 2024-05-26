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

@Entity({ name: 'exchange_rate_details' })
export class ExchangeRateDetail extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  lotId: string;

  @ManyToOne(() => Lot, (lot) => lot.teams)
  @JoinColumn({ name: 'lotId' })
  lot: Lot;

  @Column({ type: 'uuid' })
  exchangeRateId: string;

  @ManyToOne(
    () => ExchangeRate,
    (exchangeRate) => exchangeRate.exchangeRateDetails,
  )
  @JoinColumn({ name: 'exchangeRateId' })
  exchangeRate: ExchangeRate;

  @Column()
  localCurrency: string;

  @Column()
  foreignCurrency: string;

  @Column()
  rate: number;
}

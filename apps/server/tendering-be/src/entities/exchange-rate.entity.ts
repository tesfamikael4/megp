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

@Entity({ name: 'exchange_rates' })
export class ExchangeRate extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  lotId: string;

  @ManyToOne(() => Lot, (lot) => lot.exchangeRates)
  @JoinColumn({ name: 'lotId' })
  lot: Lot;

  @OneToMany(
    () => ExchangeRateDetail,
    (exchangeRateDetail) => exchangeRateDetail.exchangeRate,
  )
  exchangeRateDetails: ExchangeRateDetail[];

  @Column()
  localCurrency: string;

  @Column()
  foreignCurrency: string;

  @Column()
  rate: number;
}

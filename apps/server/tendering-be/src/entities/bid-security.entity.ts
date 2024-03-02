import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lot } from './lot.entity';

@Entity({ name: 'bid_securities' })
export class BidSecurity extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  lotId: string;

  @ManyToOne(() => Lot, (Lot) => Lot.bidSecurities)
  @JoinColumn()
  lot: Lot;

  @Column()
  bidSecurityRequired: boolean;

  @Column({ nullable: true })
  bidSecurityAmount: number;

  @Column({ nullable: true })
  bidSecurityCurrency: string;

  @Column()
  bidSecurityForm: string;
}

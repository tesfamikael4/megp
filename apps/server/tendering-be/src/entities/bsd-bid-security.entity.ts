import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lot } from './lot.entity';

@Entity({ name: 'bds_bid_securities' })
export class BdsBidSecurity extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  lotId: string;

  @ManyToOne(() => Lot, (Lot) => Lot.bdsBidSecurity)
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

import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tender } from './tender.entity';

@Entity({ name: 'scc_liabilities' })
export class SccLiability extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenderId: string;

  @ManyToOne(() => Tender, (tender) => tender.sccLiabilities)
  @JoinColumn()
  tender: Tender;

  @Column({ nullable: true })
  warrantyPeriod: number;

  @Column({ nullable: true })
  postWarrantyServicePeriod: number;

  @Column({ default: 0 })
  liquidityDamage: number;

  @Column()
  liquidityDamageLimit: number;
}

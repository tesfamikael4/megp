import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tender } from './tender.entity';

@Entity({ name: 'scc_guarantees' })
export class SccGuarantee extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenderId: string;

  @ManyToOne(() => Tender, (tender) => tender.sccGuarantees)
  @JoinColumn()
  tender: Tender;

  @Column()
  guaranteeType: string;

  @Column()
  guaranteeRequired: boolean;

  @Column()
  guaranteePercentage: number;

  @Column({ length: 4 })
  currency: string;

  @Column('text', { array: true })
  guaranteeForm: string[];

  @Column()
  validityPeriod: number;
}

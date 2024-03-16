import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tender } from './tender.entity';

@Entity({ name: 'scc_payment_schedules' })
export class SccPaymentSchedule extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenderId: string;

  @ManyToOne(() => Tender, (tender) => tender.sccPaymentSchedules)
  @JoinColumn()
  tender: Tender;

  @Column()
  paymentSchedule: string;

  @Column()
  paymentPercentage: number;

  @Column()
  order: number;

  @Column('text', { array: true })
  requiredDocuments: string[];
}

import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tender } from './tender.entity';

@Entity({ name: 'scc_contract_deliverables' })
export class SccContractDeliverable extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenderId: string;

  @ManyToOne(() => Tender, (tender) => tender.sccContractDeliverables)
  @JoinColumn()
  tender: Tender;

  @Column('text', { array: true })
  deliverable: string[];

  @Column()
  deliverySchedule: number;
}

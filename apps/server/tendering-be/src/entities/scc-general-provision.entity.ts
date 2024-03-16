import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tender } from './tender.entity';

@Entity({ name: 'scc_general_provisions' })
export class SccGeneralProvision extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenderId: string;

  @ManyToOne(() => Tender, (tender) => tender.sccGeneralProvisions)
  @JoinColumn()
  tender: Tender;

  @Column()
  contractDuration: number;

  @Column({ default: 1 })
  commencementDay: number;

  @Column()
  deliverySite: string;
}

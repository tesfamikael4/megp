import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tender } from './tender.entity';

@Entity({ name: 'tender_classifications' })
export class TenderClassification extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenderId: string;

  @ManyToOne(() => Tender, (tender) => tender.spd)
  @JoinColumn()
  tender: Tender;

  @Column({ type: 'jsonb' })
  classification: any;
}

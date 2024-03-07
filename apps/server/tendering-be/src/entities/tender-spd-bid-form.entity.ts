import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tender } from './tender.entity';

@Entity({ name: 'tender_spd_bid_forms' })
export class TenderSpdBidForm extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  code: string;

  @Column()
  type: string;

  @Column({ type: 'jsonb', nullable: true })
  documentDocx: any;

  @Column({ type: 'jsonb', nullable: true })
  documentPdf: any;

  @Column()
  tenderId: string;

  @ManyToOne(() => Tender, (tender) => tender.tenderSpdBidForm)
  @JoinColumn({ name: 'tenderId' })
  tender: Tender;
}

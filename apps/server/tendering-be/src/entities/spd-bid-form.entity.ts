import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Spd } from './spd.entity';
import { BidResponseDocument } from './bid-response-document.entity';

@Entity({ name: 'spd_bid_forms' })
export class SpdBidForm extends Audit {
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
  spdId: string;

  @ManyToOne(() => Spd, (spd) => spd.spdBidForm)
  @JoinColumn({ name: 'spdId' })
  spd: Spd;

  @OneToMany(
    () => BidResponseDocument,
    (bidResponseItems) => bidResponseItems.bidForm,
  )
  bidResponseDocuments: BidResponseDocument[];
}

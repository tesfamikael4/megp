import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Spd } from './spd.entity';
import { Audit } from 'src/shared/entities';
import { SpdBidForm } from './spd-bid-form.entity';

@Entity({ name: 'spd_qualifications' })
export class SpdQualification extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  spdId: string;

  @Column()
  category: string;

  @Column()
  factor: string;

  @Column()
  requirement: string;

  @Column()
  bidFromId: string;

  @ManyToOne(() => SpdBidForm, (spd) => spd.spdQualifications)
  @JoinColumn({ name: 'bidFromId' })
  bidFrom: SpdBidForm;

  @Column()
  itbReference: string;

  @Column({ type: 'text', nullable: true })
  itbDescription: string;

  @ManyToOne(() => Spd, (spd) => spd.spdQualifications)
  @JoinColumn({ name: 'spdId' })
  spd: Spd;
}

import { Audit } from 'megp-shared-be';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { RFX } from './rfx.entity';

@Entity({ name: 'rfx_bid_qualifications' })
@Unique(['rfxId', 'criteria'])
@Unique(['rfxId', 'order'])
export class RfxBidQualification extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  rfxId: string;

  @ManyToOne(() => RFX, (rfx) => rfx.rfxBidQualifications)
  @JoinColumn()
  rfx: RFX;

  @Column()
  criteria: string;

  @Column({ default: 1 })
  order: number;

  @Column({ nullable: true })
  description: string;
}

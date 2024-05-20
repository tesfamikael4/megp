import { Audit } from 'megp-shared-be';
import {
  Check,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RFX } from './rfx.entity';

@Entity({ name: 'rfx_bid_procedures' })
@Check('"openingDate" > "submissionDeadline"')
@Check('"submissionDeadline" > CURRENT_TIMESTAMP')
@Check(
  '"minimumBidDecrementPercentage" >= 0 AND "minimumBidDecrementPercentage" < 100',
)
export class RfxBidProcedure extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  rfxId: string;

  @OneToOne(() => RFX, (rfx) => rfx.rfxBidProcedure)
  @JoinColumn({ name: 'rfxId' })
  rfx: RFX;

  @Column()
  bidValidityPeriod: number;

  @Column({ type: 'timestamp' })
  submissionDeadline: Date;

  @Column({ type: 'timestamp' })
  openingDate: Date;

  @Column({ nullable: true, type: 'timestamp' })
  invitationDate: Date;

  @Column()
  deltaPercentage: number;

  @Column({ default: false })
  isReverseAuction: boolean;

  @Column({ default: 1 })
  round: number;

  @Column({ nullable: true })
  minimumBidDecrementPercentage: number;

  @Column()
  roundDuration: number; // in minutes

  @Column({ nullable: true })
  idleTime: number; // in minutes
}

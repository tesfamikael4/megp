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

  @Column()
  submissionDeadline: string;

  @Column()
  openingDate: string;

  @Column({ nullable: true })
  invitationDate: string;

  @Column()
  deltaPercentage: number;

  @Column({ default: 'false' })
  isReverseAuction: boolean;

  @Column({ default: 1 })
  round: number;

  @Column({ nullable: true })
  minimumBidDecrementPercentage: number;

  @Column({ nullable: true })
  roundDuration: number; // in minutes
}

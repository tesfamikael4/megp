import { Audit } from 'megp-shared-be';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { RFX } from './rfx.entity';
import { SolOffer } from './sol-offer.entity';
import { ESolRoundStatus } from 'src/utils/enums';

@Entity({ name: 'sol_rounds' })
@Unique(['rfxId', 'round'])
export class SolRound extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  rfxId: string;

  @ManyToOne(() => RFX, (rfx) => rfx.solRounds)
  @JoinColumn({ name: 'rfxId' })
  rfx: RFX;

  @Column()
  round: number;

  @Column({ type: 'timestamp' })
  start: Date;

  @Column({ type: 'timestamp' })
  end: Date;

  @Column({
    type: 'enum',
    enum: ESolRoundStatus,
    default: ESolRoundStatus.PENDING,
  })
  status: ESolRoundStatus;

  @OneToMany(() => SolOffer, (offer) => offer.round)
  offers: SolOffer[];
}

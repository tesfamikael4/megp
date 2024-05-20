import { Audit } from 'megp-shared-be';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RFX } from './rfx.entity';
import { SolOffer } from './sol-offer.entity';

@Entity({ name: 'sol_rounds' })
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

  @OneToMany(() => SolOffer, (offer) => offer.round)
  offers: SolOffer[];
}

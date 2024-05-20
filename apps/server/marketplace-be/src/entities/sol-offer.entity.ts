import { Audit } from 'megp-shared-be';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { RFXItem } from './rfx-items.entity';
import { SolRound } from './sol-round.entity';

@Entity({ name: 'sol_offers' })
@Unique(['rfxItemId', 'vendorId', 'round'])
export class SolOffer extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  rfxItemId: string;

  @ManyToOne(() => RFXItem, (rfxItem) => rfxItem.solOffers)
  @JoinColumn({ name: 'rfxItemId' })
  rfxItem: RFXItem;

  @Column()
  vendorId: string;

  @Column()
  price: number;

  @Column()
  roundId: string;

  @Column({ default: false })
  roundWinner: boolean;

  @ManyToOne(() => SolRound, (round) => round.offers)
  @JoinColumn({ name: 'roundId' })
  round: SolRound;
}
